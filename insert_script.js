const fs = require('fs');

// Read the admin.html file
fs.readFile('admin.html', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Replace the script section
  const newData = data.replace(
    /<script src="js\/hospital-form.js"><\/script>\s+<script src="js\/demo-data.js"><\/script>/,
    `<script src="js/hospital-form.js"></script>
    <script src="js/store-management.js"></script>
    <script src="js/demo-data.js"></script>`
  );

  // Write the modified content back to the file
  fs.writeFile('admin.html', newData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully added store-management.js reference to admin.html');
  });
}); 