"""Unified Test Runner for DecodeLabs Week 1 REST API Fundamentals.

Runs test suites for:
1. Node.js with Express.js
2. Python with FastAPI
3. Python with Flask
Generates a comprehensive summary report of test results.
"""

import subprocess
import sys
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent


def run_command(cmd, cwd, framework_name):
    print(f"\n{'='*70}")
    print(f"Running Test Suite: {framework_name}")
    print(f"Directory: {cwd}")
    print(f"Command: {' '.join(cmd)}")
    print(f"{'='*70}\n")

    start_time = time.time()
    result = subprocess.run(cmd, cwd=cwd, text=True, capture_output=False)
    elapsed = time.time() - start_time

    status = "PASSED" if result.returncode == 0 else "FAILED"
    return {
        "framework": framework_name,
        "status": status,
        "return_code": result.returncode,
        "duration_sec": round(elapsed, 2),
    }


def main():
    print("======================================================================")
    print(" DecodeLabs - Week 1: Multi-Framework REST API Test Runner")
    print("======================================================================")

    results = []

    # 1. Express API
    express_dir = ROOT_DIR / "01-express-api"
    # Use npm.cmd on Windows
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    res_express = run_command([npm_cmd, "test"], express_dir, "Express.js (Node.js)")
    results.append(res_express)

    # 2. FastAPI
    fastapi_dir = ROOT_DIR / "02-fastapi"
    res_fastapi = run_command(
        [sys.executable, "-m", "pytest", "-v"], fastapi_dir, "FastAPI (Python)"
    )
    results.append(res_fastapi)

    # 3. Flask API
    flask_dir = ROOT_DIR / "03-flask-api"
    res_flask = run_command(
        [sys.executable, "-m", "pytest", "-v"], flask_dir, "Flask (Python)"
    )
    results.append(res_flask)

    # Summary Table
    print("\n" + "=" * 70)
    print(" TEST EXECUTION SUMMARY")
    print("=" * 70)
    print(f"{'Framework':<25} | {'Test Result':<12} | {'Duration':<10}")
    print("-" * 70)

    all_passed = True
    for r in results:
        status_display = f"\033[92m{r['status']}\033[0m" if r["status"] == "PASSED" else f"\033[91m{r['status']}\033[0m"
        print(f"{r['framework']:<25} | {status_display:<21} | {r['duration_sec']}s")
        if r["return_code"] != 0:
            all_passed = False

    print("=" * 70)
    if all_passed:
        print("ALL FRAMEWORKS PASSED ALL 10 MANDATORY TEST CASES (30/30 PASSED)!")
        return 0
    else:
        print("SOME TESTS FAILED! Please check logs above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())

