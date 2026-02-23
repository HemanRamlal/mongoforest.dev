const fs = require("fs");
const path = require("path");

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateExpectedOutputs() {
  const COOKIE = process.env.COOKIE || "";

  // Use paths relative to project root
  const problemsetPath = path.join(process.cwd(), "docker-image-src/data/movies-problemset.json");
  const problemset = JSON.parse(fs.readFileSync(problemsetPath, "utf-8"));

  const expectedOutputs = {};

  for (const problem of problemset) {
    const pid = problem.id + 400;
    const problemSlug = slugify(problem.title);
    const submittedCode = problem.solution;

    const samplecasesDir = path.join(
      process.cwd(),
      `samplecases/${String(pid - 400).padStart(3, "0")}`
    );
    const testcases = [];

    for (let i = 1; i <= 3; i++) {
      const testcasePath = path.join(samplecasesDir, `${String(i).padStart(3, "0")}.json`);
      if (fs.existsSync(testcasePath)) {
        const testcaseData = JSON.parse(fs.readFileSync(testcasePath, "utf-8"));
        testcases.push(testcaseData);
      }
    }

    if (testcases.length === 0) {
      console.log(`⚠ Skipping problem ${pid}: No testcases found`);
      continue;
    }

    console.log(`Processing problem ${pid}: ${problem.title}`);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (COOKIE) {
        headers["Cookie"] = COOKIE;
      }

      // Make API call
      const res = await fetch(`http://localhost:3000/problem/${problemSlug}/run`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          submittedCode: submittedCode,
          testcases: testcases,
        }),
      });

      if (!res.ok) {
        console.error(`❌ Failed to run problem ${pid}: ${res.status} ${res.statusText}`);
        const errorData = await res.json();
        console.error(errorData);
        continue;
      }

      const data = await res.json();

      // Store outputs
      expectedOutputs[pid] = data.outputs;

      console.log(`✓ Problem ${pid} completed. Got ${data.outputs.length} outputs.`);
      console.log(`  Verdicts: ${data.verdicts.join(", ")}`);

      // Add delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error processing problem ${pid}:`, error.message);
    }
  }

  const outputPath = path.join(process.cwd(), "docker-image-src/data/expected-outputs.json");
  fs.writeFileSync(outputPath, JSON.stringify(expectedOutputs, null, 2));

  console.log(`\n✅ Expected outputs written to: ${outputPath}`);
  console.log(
    `Total problems processed: ${Object.keys(expectedOutputs).length}/${problemset.length}`
  );
}

generateExpectedOutputs().catch(console.error);
