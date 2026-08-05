import fs from 'fs';
import path from 'path';

const GITHUB_PAT = process.env.GITHUB_PAT || '';
const REPO_OWNER = 'charanviveksai';
const REPO_NAME = 'collage-Hackaton';
const BRANCH = 'main';

// Excluded directories and files from push
const EXCLUDE_PATHS = [
  'node_modules',
  'dist',
  'dist-server',
  '.git',
  '.env',
  '.DS_Store',
  'Thumbs.db',
];

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    const shouldExclude = EXCLUDE_PATHS.some((ex) => relPath === ex || relPath.startsWith(ex + '/'));

    if (!shouldExclude) {
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(relPath);
      }
    }
  });

  return arrayOfFiles;
}

async function getExistingFileSha(filePath: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'AI-Assistant-Uploader',
        },
      }
    );

    if (response.ok) {
      const data: any = await response.json();
      return data.sha || null;
    }
  } catch (err) {
    // File doesn't exist yet
  }
  return null;
}

async function uploadFile(filePath: string): Promise<boolean> {
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    const fileBuffer = fs.readFileSync(absolutePath);
    const base64Content = fileBuffer.toString('base64');
    const existingSha = await getExistingFileSha(filePath);

    const payload: any = {
      message: `feat: add ${filePath}`,
      content: base64Content,
      branch: BRANCH,
    };

    if (existingSha) {
      payload.sha = existingSha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'AI-Assistant-Uploader',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ Failed to upload ${filePath}:`, errText);
      return false;
    }

    console.log(`✅ Uploaded: ${filePath}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return false;
  }
}

async function pushRepository() {
  console.log('====================================================');
  console.log(`🚀 Uploading project files to GitHub repository: ${REPO_OWNER}/${REPO_NAME}`);
  console.log('====================================================\n');

  const files = getAllFiles(process.cwd());
  console.log(`Found ${files.length} project files to commit & push.\n`);

  let successCount = 0;
  for (const file of files) {
    const success = await uploadFile(file);
    if (success) successCount++;
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('\n====================================================');
  console.log('🎉 GITHUB REPOSITORY PUSH COMPLETE!');
  console.log(`• Total Files Uploaded: ${successCount} / ${files.length}`);
  console.log(`• GitHub Link: https://github.com/${REPO_OWNER}/${REPO_NAME}`);
  console.log('====================================================\n');
}

pushRepository();
