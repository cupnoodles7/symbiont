#!/usr/bin/env node

// Build test script to identify potential issues
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for common build issues...\n');

// Check 1: Verify all imports exist
function checkImports() {
    console.log('📁 Checking component imports...');
    const componentsDir = path.join(__dirname, 'client/src/components');

    if (!fs.existsSync(componentsDir)) {
        console.log('❌ Components directory not found!');
        return;
    }

    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

    files.forEach(file => {
        const filePath = path.join(componentsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for relative imports
        const imports = content.match(/import .* from ['"]\.\/.*['"]/g) || [];
        imports.forEach(imp => {
            const match = imp.match(/from ['"]\.\/(.*)['"]/) || imp.match(/from ["']\.\/(.*)["']/);
            if (match) {
                const importedFile = match[1];
                const expectedPath = path.join(componentsDir, importedFile + '.jsx');
                const altPath = path.join(componentsDir, importedFile + '.js');

                if (!fs.existsSync(expectedPath) && !fs.existsSync(altPath)) {
                    console.log(`⚠️  ${file}: Missing import ${importedFile}`);
                } else {
                    console.log(`✅ ${file}: ${importedFile} exists`);
                }
            }
        });
    });
}

// Check 2: Verify API config
function checkApiConfig() {
    console.log('\n🔗 Checking API configuration...');
    const apiConfigPath = path.join(__dirname, 'client/src/config/api.js');

    if (!fs.existsSync(apiConfigPath)) {
        console.log('❌ API config file missing!');
        return;
    }

    console.log('✅ API config file exists');

    // Check if components are using API_ENDPOINTS
    const componentsDir = path.join(__dirname, 'client/src/components');
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

    files.forEach(file => {
        const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
        if (content.includes('localhost:') && !content.includes('API_ENDPOINTS')) {
            console.log(`⚠️  ${file}: Still using localhost URLs`);
        } else if (content.includes('API_ENDPOINTS')) {
            console.log(`✅ ${file}: Using API_ENDPOINTS`);
        }
    });
}

// Check 3: Package.json dependencies
function checkDependencies() {
    console.log('\n📦 Checking dependencies...');
    const packagePath = path.join(__dirname, 'client/package.json');

    if (!fs.existsSync(packagePath)) {
        console.log('❌ Client package.json not found!');
        return;
    }

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredDeps = ['react', 'react-dom', 'vite', 'axios'];

    requiredDeps.forEach(dep => {
        if (pkg.dependencies[dep] || pkg.devDependencies[dep]) {
            console.log(`✅ ${dep}: Found`);
        } else {
            console.log(`❌ ${dep}: Missing`);
        }
    });
}

// Run all checks
checkImports();
checkApiConfig();
checkDependencies();

console.log('\n🎯 Build check complete!');
console.log('\n💡 To test build locally:');
console.log('   cd client && npm install && npm run build');
