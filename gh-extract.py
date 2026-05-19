#!/usr/bin/env python3
"""
GitHub Source Code Extractor
----------------------------
Extracts source code from any GitHub repository with an open-source license.
"""

import argparse
import csv
import json
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import requests
from colorama import init, Fore, Style
from git import Repo as GitRepo, GitCommandError

init(autoreset=True)

OPEN_SOURCE_LICENSES = {
    "mit", "apache-2.0", "gpl-2.0", "gpl-3.0", "lgpl-2.1", "lgpl-3.0",
    "bsd-2-clause", "bsd-3-clause", "mpl-2.0", "unlicense", "cc0-1.0",
    "isc", "artistic-2.0", "epl-2.0", "agpl-3.0", "bsl-1.0",
}

GITHUB_API = "https://api.github.com"


@dataclass
class RepoInfo:
    owner: str
    name: str
    full_name: str
    description: str
    license_key: Optional[str]
    license_name: Optional[str]
    is_open_source: bool
    default_branch: str
    language: Optional[str]
    stars: int
    forks: int
    topics: list
    clone_url: str
    size_kb: int


def parse_repo_input(input_str: str) -> tuple[str, str]:
    input_str = input_str.strip().rstrip("/")
    if input_str.endswith(".git"):
        input_str = input_str[:-4]

    if input_str.startswith("http://") or input_str.startswith("https://"):
        parts = urlparse(input_str)
        path = parts.path.strip("/")
        if path.count("/") >= 2:
            parts = path.split("/")[-2:]
        else:
            parts = path.split("/")
    else:
        parts = input_str.split("/")

    if len(parts) != 2 or not parts[0] or not parts[1]:
        raise ValueError(
            f"Invalid repo format: '{input_str}'. Use 'owner/repo' or full URL."
        )
    return parts[0], parts[1]


def _github_headers(token: Optional[str] = None) -> dict:
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        headers["Authorization"] = f"token {token}"
    return headers


def _extract_lic(lic: Optional[dict]) -> tuple[Optional[str], Optional[str]]:
    if not lic:
        return None, None
    key = lic.get("spdx_id", "").lower()
    name = lic.get("name")
    if key in ("", "no-license"):
        return None, None
    return key, name


def fetch_repo_info(owner: str, repo: str, token: Optional[str] = None) -> RepoInfo:
    url = f"{GITHUB_API}/repos/{owner}/{repo}"
    resp = requests.get(url, headers=_github_headers(token), timeout=30)
    if resp.status_code == 403:
        print(f"{Fore.RED}Rate limited. Use a GitHub token (--token) for higher limits.{Style.RESET_ALL}")
    elif resp.status_code == 404:
        print(f"{Fore.RED}Repository '{owner}/{repo}' not found.{Style.RESET_ALL}")
    resp.raise_for_status()

    data = resp.json()
    lic_key, lic_name = _extract_lic(data.get("license"))

    return RepoInfo(
        owner=owner,
        name=repo,
        full_name=data["full_name"],
        description=data.get("description") or "",
        license_key=lic_key,
        license_name=lic_name,
        is_open_source=lic_key in OPEN_SOURCE_LICENSES if lic_key else False,
        default_branch=data.get("default_branch", "main"),
        language=data.get("language"),
        stars=data.get("stargazers_count", 0),
        forks=data.get("forks_count", 0),
        topics=data.get("topics", []),
        clone_url=data["clone_url"],
        size_kb=data.get("size", 0),
    )


def print_repo_info(info: RepoInfo):
    if info.is_open_source:
        lic_display = f"{Fore.GREEN}{info.license_name}{Style.RESET_ALL}"
    elif info.license_name:
        lic_display = f"{Fore.YELLOW}{info.license_name}{Style.RESET_ALL}"
    else:
        lic_display = f"{Fore.RED}No License{Style.RESET_ALL}"

    os_tag = f"{Fore.GREEN}OPEN SOURCE{Style.RESET_ALL}" if info.is_open_source else f"{Fore.RED}RESTRICTED{Style.RESET_ALL}"

    size_str = f"{info.size_kb / 1024:.1f} MB" if info.size_kb > 0 else "N/A"

    print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f" {Fore.WHITE}{Style.BRIGHT}{info.full_name}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f"  Description : {info.description or 'N/A'}")
    print(f"  License     : {lic_display}")
    print(f"  Status      : {os_tag}")
    print(f"  Language    : {info.language or 'N/A'}")
    print(f"  Branch      : {info.default_branch}")
    print(f"  Stars       : {info.stars:,}")
    print(f"  Forks       : {info.forks:,}")
    print(f"  Size        : {size_str}")
    if info.topics:
        print(f"  Topics      : {', '.join(info.topics[:10])}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")


def clone_repo(info: RepoInfo, output_dir: Path, shallow: bool = True) -> Path:
    dest = output_dir / info.name
    if dest.exists():
        print(f"{Fore.YELLOW}Directory '{dest}' already exists. Skipping clone.{Style.RESET_ALL}")
        return dest

    print(f"{Fore.CYAN}Cloning into {Fore.WHITE}{Style.BRIGHT}{dest}{Style.RESET_ALL} ...")
    kwargs = {"depth": 1} if shallow else {}
    try:
        GitRepo.clone_from(info.clone_url, str(dest), **kwargs)
        print(f"{Fore.GREEN}Done!{Style.RESET_ALL}")
    except GitCommandError as e:
        print(f"{Fore.RED}Clone failed: {e}{Style.RESET_ALL}")
        raise
    return dest


def download_zip(info: RepoInfo, output_dir: Path, token: Optional[str] = None) -> Path:
    zip_url = f"{GITHUB_API}/repos/{info.owner}/{info.name}/zipball/{info.default_branch}"
    print(f"{Fore.CYAN}Downloading ZIP archive ...{Style.RESET_ALL}")

    resp = requests.get(zip_url, headers=_github_headers(token), stream=True, timeout=300)
    resp.raise_for_status()

    dest = output_dir / f"{info.name}.zip"
    with open(dest, "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            f.write(chunk)

    size_mb = dest.stat().st_size / 1024 / 1024
    print(f"{Fore.GREEN}Downloaded: {dest} ({size_mb:.1f} MB){Style.RESET_ALL}")
    return dest


def search_repos(
    query: str,
    token: Optional[str] = None,
    license_filter: Optional[str] = None,
    lang: Optional[str] = None,
    stars: Optional[int] = None,
    limit: int = 10,
) -> list[RepoInfo]:
    q_parts = [query]
    if license_filter:
        q_parts.append(f"license:{license_filter}")
    if lang:
        q_parts.append(f"language:{lang}")
    if stars:
        q_parts.append(f"stars:>={stars}")

    url = f"{GITHUB_API}/search/repositories"
    params = {"q": " ".join(q_parts), "per_page": min(limit, 100), "sort": "stars", "order": "desc"}

    resp = requests.get(url, headers=_github_headers(token), params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    results = []
    for item in data.get("items", [])[:limit]:
        lic_key, lic_name = _extract_lic(item.get("license"))
        results.append(RepoInfo(
            owner=item["owner"]["login"],
            name=item["name"],
            full_name=item["full_name"],
            description=item.get("description") or "",
            license_key=lic_key,
            license_name=lic_name,
            is_open_source=lic_key in OPEN_SOURCE_LICENSES if lic_key else False,
            default_branch=item.get("default_branch", "main"),
            language=item.get("language"),
            stars=item.get("stargazers_count", 0),
            forks=item.get("forks_count", 0),
            topics=item.get("topics", []),
            clone_url=item["clone_url"],
            size_kb=item.get("size", 0),
        ))
    return results


def verify_license(info: RepoInfo, strict: bool) -> bool:
    if not info.license_key:
        if strict:
            print(f"{Fore.RED}No license found. Skipping.{Style.RESET_ALL}")
            return False
        print(f"{Fore.YELLOW}Warning: No license detected. Use --strict to enforce licensing.{Style.RESET_ALL}")
        return True
    if not info.is_open_source:
        print(f"{Fore.RED}License '{info.license_name}' is not an approved open-source license.{Style.RESET_ALL}")
        return False
    return True


def load_repo_list(file_path: str) -> list[str]:
    path = Path(file_path)
    if not path.exists():
        print(f"{Fore.RED}File not found: {file_path}{Style.RESET_ALL}")
        sys.exit(1)

    entries = []
    if path.suffix.lower() == ".csv":
        with open(path, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                if row:
                    entries.append(row[0].strip())
    else:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    entries.append(line)
    return entries


def export_results(results: list[RepoInfo], file_path: str, fmt: str):
    data = [asdict(r) for r in results]
    if fmt == "csv" and data:
        with open(file_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
    else:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    print(f"{Fore.GREEN}Exported {len(results)} result(s) to {file_path}{Style.RESET_ALL}")


def stats(directory: Path):
    if not directory.exists():
        return

    subdirs = [d for d in directory.iterdir() if d.is_dir() and not d.name.startswith(".")]
    zip_files = list(directory.glob("*.zip"))

    if not subdirs and not zip_files:
        return

    total_size = sum(
        sum(f.stat().st_size for f in d.rglob("*") if f.is_file())
        for d in subdirs
    )

    print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f" {Fore.WHITE}{Style.BRIGHT}Summary{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f"  Output dir  : {directory.resolve()}")
    print(f"  Repos cloned: {len(subdirs)}")
    print(f"  ZIP archives: {len(zip_files)}")
    print(f"  Total size  : {total_size / 1024 / 1024:.1f} MB")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="gh-extract",
        description="Extract source code from open-source GitHub repositories.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  gh-extract facebook/react\n"
            "  gh-extract https://github.com/torvalds/linux --out ./projects\n"
            '  gh-extract --search "machine learning" --lang python --stars 1000 --limit 5\n'
            "  gh-extract --batch repos.txt --strict\n"
        ),
    )

    target = parser.add_argument_group("target")
    target.add_argument("repo", nargs="?", help="Repository: 'owner/repo' or full URL")
    target.add_argument("-s", "--search", help="Search repositories by keyword")
    target.add_argument("-b", "--batch", help="Batch file with repo list (one per line, or CSV)")

    parser.add_argument("-o", "--out", default="./extracted", help="Output directory (default: ./extracted)")
    parser.add_argument("--token", help="GitHub personal access token (for higher rate limits)")
    parser.add_argument("--zip", action="store_true", help="Download as ZIP instead of git clone")
    parser.add_argument("--no-shallow", action="store_true", help="Full clone (not shallow)")
    parser.add_argument("--strict", action="store_true", help="Skip repos without an open-source license")
    parser.add_argument("--no-verify", action="store_true", help="Skip license verification")

    search_group = parser.add_argument_group("search filters (used with --search)")
    search_group.add_argument("--lang", help="Filter by language (e.g., python, rust, go)")
    search_group.add_argument("--license", help="Filter by license (e.g., mit, apache-2.0, gpl-3.0)")
    search_group.add_argument("--stars", type=int, help="Minimum stars")
    search_group.add_argument("--limit", type=int, default=10, help="Max search results (default: 10)")

    parser.add_argument("--export", help="Export repo info to file (use --export-format)")
    parser.add_argument("--export-format", choices=["json", "csv"], default="json", help="Export format (default: json)")
    parser.add_argument("-q", "--quiet", action="store_true", help="Minimal output")

    return parser


def validate_args(args):
    if not args.repo and not args.search and not args.batch:
        return False
    return True


def collect_repos_from_search(args) -> list[RepoInfo]:
    if not args.quiet:
        print(f"{Fore.CYAN}Searching for '{args.search}' ...{Style.RESET_ALL}")

    results = search_repos(
        query=args.search,
        token=args.token,
        license_filter=args.license,
        lang=args.lang,
        stars=args.stars,
        limit=args.limit,
    )

    if not results:
        print(f"{Fore.YELLOW}No results found.{Style.RESET_ALL}")
        return []

    for r in results:
        print_repo_info(r)

    return results


def process_one_repo(repo_str: str, args, output_dir, idx: int, total: int) -> Optional[RepoInfo]:
    try:
        owner, name = parse_repo_input(repo_str)
    except ValueError as e:
        print(f"{Fore.RED}[{idx}/{total}] Error: {e}{Style.RESET_ALL}")
        return None

    if not args.quiet:
        print(f"\n{Fore.CYAN}[{idx}/{total}]{Style.RESET_ALL} Processing {Fore.WHITE}{Style.BRIGHT}{owner}/{name}{Style.RESET_ALL} ...")

    try:
        info = fetch_repo_info(owner, name, args.token)
    except Exception as e:
        print(f"{Fore.RED}Failed to fetch info: {e}{Style.RESET_ALL}")
        return None

    if not args.quiet:
        print_repo_info(info)

    if not args.no_verify and not verify_license(info, args.strict):
        return None

    try:
        if args.zip:
            download_zip(info, output_dir, args.token)
        else:
            clone_repo(info, output_dir, shallow=not args.no_shallow)
    except Exception as e:
        print(f"{Fore.RED}Download failed: {e}{Style.RESET_ALL}")
        return None

    return info


def main():
    parser = build_parser()
    args = parser.parse_args()

    if not validate_args(args):
        parser.print_help()
        print(f"\n{Fore.RED}Error: Provide a repo, --search, or --batch.{Style.RESET_ALL}")
        sys.exit(1)

    output_dir = Path(args.out)
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.search:
        search_results = collect_repos_from_search(args)
        if not search_results:
            return

        repos_to_process = [
            r.full_name for r in search_results
            if not args.strict or r.is_open_source
        ]

        if args.export:
            filtered = [r for r in search_results if not args.strict or r.is_open_source]
            export_results(filtered, args.export, args.export_format)
    elif args.batch:
        repos_to_process = load_repo_list(args.batch)
        if not repos_to_process:
            print(f"{Fore.YELLOW}No repos found in {args.batch}{Style.RESET_ALL}")
            return
    else:
        repos_to_process = [args.repo]

    downloaded: list[RepoInfo] = []
    for i, repo_str in enumerate(repos_to_process, 1):
        info = process_one_repo(repo_str, args, output_dir, i, len(repos_to_process))
        if info:
            downloaded.append(info)
        if i < len(repos_to_process):
            print()

    if args.export and not args.search and downloaded:
        export_results(downloaded, args.export, args.export_format)

    stats(output_dir)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Interrupted.{Style.RESET_ALL}")
        sys.exit(1)
    except Exception as e:
        print(f"{Fore.RED}Error: {e}{Style.RESET_ALL}")
        sys.exit(1)
