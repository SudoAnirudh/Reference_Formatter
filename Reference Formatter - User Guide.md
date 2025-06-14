# Reference Formatter - User Guide

## Overview
The Reference Formatter is a web application that allows you to input reference information and convert it into various academic citation formats including IEEE, APA, MLA, Chicago, and Harvard styles.

## Features
- Support for multiple reference types: Books, Journal Articles, Websites, Conference Papers, Theses/Dissertations, and Technical Reports
- Multiple citation formats: IEEE, APA 7th Edition, MLA 9th Edition, Chicago, and Harvard
- Dynamic form fields that adapt based on reference type
- Support for multiple authors per reference
- Ability to add multiple references
- Copy to clipboard functionality
- Download formatted references as text file
- Responsive design for desktop and mobile devices

## How to Use

### Adding References
1. Select the reference type from the dropdown menu
2. Enter the publication year
3. Add author names (you can add multiple authors using the "Add Author" button)
4. Enter the title of the work
5. Fill in additional fields that appear based on the reference type:
   - For journal articles: Journal/Conference Name
   - For books: Publisher
   - For websites: URL
6. Click "Add Another Reference" to add more references

### Generating Citations
1. Select your desired citation format from the dropdown
2. Click "Generate Citations"
3. The formatted references will appear in the output area
4. Use the "Copy" button to copy to clipboard or "Download" to save as a text file

## Supported Citation Formats

### IEEE
- Uses numbered citations in square brackets
- Follows IEEE Editorial Style Manual guidelines
- Example: [1] J. Smith, "Title," Journal Name, vol. 1, no. 1, pp. 1-10, 2024.

### APA 7th Edition
- Uses author-date format
- Follows American Psychological Association guidelines
- Example: Smith, J. (2024). Title. Journal Name, 1(1), 1-10.

### MLA 9th Edition
- Uses author-page format
- Follows Modern Language Association guidelines
- Example: Smith, John. "Title." Journal Name, vol. 1, no. 1, 2024, pp. 1-10.

### Chicago
- Uses author-date format for citations
- Follows Chicago Manual of Style guidelines
- Example: Smith, John. "Title." Journal Name 1, no. 1 (2024): 1-10.

### Harvard
- Uses author-date format
- Follows Harvard referencing style
- Example: Smith, J 2024, 'Title', Journal Name, vol. 1, no. 1, pp. 1-10.

## Tips for Best Results
- Ensure all required fields are filled out completely
- Use consistent formatting for author names
- Double-check publication years and page numbers
- For websites, include access dates when available
- Review the generated citations for accuracy before use

## Technical Details
- Built with React.js and modern web technologies
- Responsive design works on all devices
- No data is stored or transmitted - all processing happens in your browser
- Works offline once loaded

