import { SpawnSyncReturns, spawnSync } from 'child_process';

/**
 * Class that can be used to execute Git commands within a
 * given project directory.
 *
 * Relying on the working directory of the current process is
 * not good because it's not guaranteed that the working directory
 * is always the target project directory.
 */
export class GitClient {
  constructor(public projectDir: string, public remoteGitUrl: string) {}

  /** Gets the currently checked out branch for the project directory. */
  getCurrentBranch(): string {
    return this._spawnGitProcess([
      'symbolic-ref',
      '--short',
      'HEAD',
    ]).stdout.trim();
  }

  /** Gets the commit SHA for the specified remote repository branch. */
  getRemoteCommitSha(branchName: string): string {
    return this._spawnGitProcess([
      'ls-remote',
      this.remoteGitUrl,
      '-h',
      `refs/heads/${branchName}`,
    ])
      .stdout.split('\t')[0]
      .trim();
  }

  /** Gets the latest commit SHA for the specified git reference. */
  getLocalCommitSha(refName: string): string {
    return this._spawnGitProcess(['rev-parse', refName]).stdout.trim();
  }

  /** Gets whether the current Git repository has uncommitted changes. */
  hasUncommittedChanges(): boolean {
    return (
      this._spawnGitProcess(['diff-index', '--quiet', 'HEAD']).status !== 0
    );
  }

  /** Checks out an existing branch with the specified name. */
  checkoutBranch(branchName: string): boolean {
    return this._spawnGitProcess(['checkout', branchName]).status === 0;
  }

  /** Creates a new branch which is based on the previous active branch. */
  checkoutNewBranch(branchName: string): boolean {
    return this._spawnGitProcess(['checkout', '-b', branchName]).status === 0;
  }

  /** Stages all changes by running `git add -A`. */
  stageAllChanges(): boolean {
    return this._spawnGitProcess(['add', '-A']).status === 0;
  }

  /**
   * Creates a new commit within the current branch with the
   * given commit message.
   */
  createNewCommit(message: string): boolean {
    return this._spawnGitProcess(['commit', '-m', message]).status === 0;
  }

  /** Creates a tag for the specified commit reference. */
  createTag(tagName: string): boolean {
    return this._spawnGitProcess(['tag', tagName]).status === 0;
  }

  /** Push committed changes to remote */
  pushBranchOrTagToRemote(branchOrTagName: string): boolean {
    return (
      this._spawnGitProcess(['push', this.remoteGitUrl, branchOrTagName])
        .status === 0
    );
  }

  /** Gets the last commit on the current branch. */
  getLastCommit(): string {
    return this._spawnGitProcess(['log', '-1']).stdout.trim();
  }

  /** Cherrypicks a commit into the current branch */
  cherrypick(commitNumber: string): { output: string; success: boolean } {
    const response = this._spawnGitProcess(['cherry-pick', commitNumber]);
    const success = response.status === 0;
    return {
      success,
      output: response.stdout.toString(),
    };
  }

  /** Run a clone into the current directory. */
  clone(): boolean {
    return this._spawnGitProcess(['clone', this.remoteGitUrl, '.']).status === 0;
  }

  /**
   * Spawns a child process running Git.
   * The "stderr" output is inherited and will be printed in case of errors.
   * This makes it easier to debug failed commands.
   */
  private _spawnGitProcess(
    args: string[],
    printStderr = true,
  ): SpawnSyncReturns<string> {
    return spawnSync('git', args, {
      cwd: this.projectDir,
      stdio: ['pipe', 'pipe', printStderr ? 'inherit' : 'pipe'],
      encoding: 'utf8',
    });
  }
}
