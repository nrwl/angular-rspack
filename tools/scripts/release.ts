import {
  releaseChangelog,
  releaseVersion,
  releasePublish,
} from 'nx/src/command-line/release';
import yargs from 'yargs';
import { parse } from 'semver';

export function deriveDistTagFromSpecifier(distTag: string, specifier: string) {
  // dist-tag was explicitly set
  if (distTag && distTag !== 'infer-from-specifier') {
    return distTag;
  }

  // Derive dist-tag from specifier
  if (
    specifier.startsWith('pre') ||
    specifier.includes('-alpha') ||
    specifier.includes('-beta')
  ) {
    return 'next';
  }

  if (parse(specifier)?.prerelease.length) {
    return 'next';
  }

  return 'latest';
}

(async () => {
  try {
    const options = await yargs
      .version(false)
      .option('version', {
        description:
          'Explicit version specifier to use, if overriding conventional commits',
        type: 'string',
      })
      .option('dist-tag', {
        description:
          'dist-tag to use for publish to https://registry.npmjs.org',
        type: 'string',
        choices: ['infer-from-specifier', 'latest', 'next'],
        default: 'infer-from-specifier',
      })
      .option('first-release', {
        description:
          'Whether or not this is the first release of any packages in the group',
        type: 'boolean',
        default: false,
      })
      .option('dry-run', {
        alias: 'd',
        description:
          'Whether or not to perform a dry-run of the release process, defaults to true',
        type: 'boolean',
        default: true,
      })
      .option('verbose', {
        description:
          'Whether or not to enable verbose logging, defaults to false',
        type: 'boolean',
        default: false,
      })
      .parseAsync();

    const { workspaceVersion, projectsVersionData } = await releaseVersion({
      specifier: options.version,
      // stage package.json updates to be committed later by the changelog command
      stageChanges: true,
      dryRun: options.dryRun,
      verbose: options.verbose,
    });

    await releaseChangelog({
      gitCommit: true,
      gitPush: true,
      gitTag: true,
      versionData: projectsVersionData,
      version: workspaceVersion,
      dryRun: options.dryRun,
      verbose: options.verbose,
      firstRelease: options.firstRelease,
    });

    await releasePublish({
      firstRelease: options.firstRelease,
      tag: deriveDistTagFromSpecifier(options.distTag, options.version),
      dryRun: options.dryRun,
      verbose: options.verbose,
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
