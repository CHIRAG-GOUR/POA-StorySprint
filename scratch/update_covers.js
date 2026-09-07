const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/characterStoriesData.ts');
let code = fs.readFileSync(filePath, 'utf8');

// Replace Naruto covers
code = code.replace(/heroId:\s*'hero-naruto'([\s\S]*?)coverImage:\s*'[^']+'/g, "heroId: 'hero-naruto'$1coverImage: '/assets/cover_naruto.webp'");

// Replace Goku covers
code = code.replace(/heroId:\s*'hero-goku'([\s\S]*?)coverImage:\s*'[^']+'/g, "heroId: 'hero-goku'$1coverImage: '/assets/cover_goku.webp'");

// Replace Po covers
code = code.replace(/heroId:\s*'hero-po'([\s\S]*?)coverImage:\s*'[^']+'/g, "heroId: 'hero-po'$1coverImage: '/assets/cover_po.webp'");

// Replace Iron Man covers
code = code.replace(/heroId:\s*'hero-ironman'([\s\S]*?)coverImage:\s*'[^']+'/g, "heroId: 'hero-ironman'$1coverImage: '/assets/cover_ironman.webp'");

fs.writeFileSync(filePath, code, 'utf8');
console.log('Cover images updated in characterStoriesData.ts');
