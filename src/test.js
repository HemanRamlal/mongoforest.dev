const fs = require('fs');
const path = require('path');

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateExpectedOutputs() {
  const COOKIE = process.env.COOKIE || "";
  
  // Use paths relative to project root
  const problemsetPath = path.join(process.cwd(), 'docker-image-src/data/movies-problemset.json');
  const problemset = JSON.parse(fs.readFileSync(problemsetPath, 'utf-8'));
  
  const expectedOutputs = {};
  
  for (const problem of problemset) {
    const pid = problem.id + 400;
    const problemSlug = slugify(problem.title);
    const submittedCode = problem.solution;
    
    const samplecasesDir = path.join(process.cwd(), `samplecases/${String(pid - 400).padStart(3, '0')}`);
    const testcases = [];
    
    for (let i = 1; i <= 3; i++) {
      const testcasePath = path.join(samplecasesDir, `${String(i).padStart(3, '0')}.json`);
      if (fs.existsSync(testcasePath)) {
        const testcaseData = JSON.parse(fs.readFileSync(testcasePath, 'utf-8'));
        testcases.push(testcaseData);
      }
    }
    for (let i = 1; i <= 3; i++) {
    if (testcases.length === 0) {in(samplecasesDir, `${String(i).padStart(3, '0')}.json`);
      console.log(`⚠ Skipping problem ${pid}: No testcases found`);
      continue;fs.readFileSync(testcasePath, 'utf-8'));
    }
    
    console.log(`Processing problem ${pid}: ${problem.title}`);
    
    try {if (testcases.length === 0) {
      const headers = {blem ${pid}: No testcases found`);
        "Content-Type": "application/json"
      };
      
      if (COOKIE) {console.log(`Processing problem ${pid}: ${problem.title}`);
        headers["Cookie"] = COOKIE;
      }try {
      st headers = {
      // Make API call "application/json"
      const res = await fetch(`http://localhost:3000/problem/${problemSlug}/run`, {
        method: "POST",
        headers: headers,if (COOKIE) {
        body: JSON.stringify({okie"] = COOKIE;
          submittedCode: submittedCode,
          testcases: testcases
        })const res = await fetch(`http://localhost:3000/problem/${problemSlug}/run`, {
      });,
      
      if (!res.ok) {ngify({
        console.error(`❌ Failed to run problem ${pid}: ${res.status} ${res.statusText}`);submittedCode,
        const errorData = await res.json();
        console.error(errorData);
        continue;
      }
      (!res.ok) {
      const data = await res.json();  console.error(`❌ Failed to run problem ${pid}: ${res.status} ${res.statusText}`);
      ata = await res.json();
      // Store outputs
      expectedOutputs[pid] = data.outputs;
      
      console.log(`✓ Problem ${pid} completed. Got ${data.outputs.length} outputs.`);
      console.log(`  Verdicts: ${data.verdicts.join(', ')}`);onst data = await res.json();
      
      // Add delay to avoid overwhelming the servertputs;
      await new Promise(resolve => setTimeout(resolve, 500));
      roblem ${pid} completed. Got ${data.outputs.length} outputs.`);
    } catch (error) {icts.join(', ')}`);
      console.error(`❌ Error processing problem ${pid}:`, error.message);
    }
  }
  catch (error) {
  const outputPath = path.join(process.cwd(), 'docker-image-src/data/expected-outputs.json');id}:`, error.message);
  fs.writeFileSync(outputPath, JSON.stringify(expectedOutputs, null, 2));
  
  console.log(`\n✅ Expected outputs written to: ${outputPath}`);
  console.log(`Total problems processed: ${Object.keys(expectedOutputs).length}/${problemset.length}`);
}st outputPath = path.resolve(__dirname, '../../docker-image-src/data/expected-outputs.json');
s.writeFileSync(outputPath, JSON.stringify(expectedOutputs, null, 2));
generateExpectedOutputs().catch(console.error);
