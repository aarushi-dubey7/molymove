# Build the project
npm run build

# Navigate into the build output directory
cd dist

# Initialize a new git repository
git init
git checkout -b gh-pages

# Add all files
git add -A

# Commit
git commit -m 'deploy'

# Push to the gh-pages branch
# using the https URL to ensure we can push (might prompt for credentials if not cached)
git push -f https://aarushi-dubey7@github.com/aarushi-dubey7/molymove.git gh-pages

# Navigate back
cd ..
