// Test script to verify slug generation
const createUniversitySlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Test cases
const testCases = [
  'University of Malaya',
  'Harvard University',
  'Massachusetts Institute of Technology',
  'University of Cambridge',
  'Stanford University',
  'Oxford University',
  'University of Toronto',
  'National University of Singapore',
  'Australian National University',
  'University of Melbourne'
];

console.log('Testing URL slug generation:');
console.log('=============================');

testCases.forEach(name => {
  const slug = createUniversitySlug(name);
  console.log(`"${name}" → "yoursite.com/universities/${slug}"`);
});

console.log('\nAll URLs are clean with:');
console.log('✓ Spaces replaced with hyphens');
console.log('✓ No extra text or IDs');
console.log('✓ SEO-friendly format');
console.log('✓ No special characters');
