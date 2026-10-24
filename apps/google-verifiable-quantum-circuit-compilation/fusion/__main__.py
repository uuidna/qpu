import sys

from .score import score_of

if __name__ == "__main__":
    print(score_of(sys.argv[1]).line())
