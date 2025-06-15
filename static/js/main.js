document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const referencesContainer = document.getElementById('references-container'); // This will hold all reference item divs
    const addReferenceButton = document.getElementById('add-another-reference-btn');
    const citationFormatSelect = document.getElementById('citation-format-select');
    const generateButton = document.getElementById('generate-citations-btn');
    const formattedOutputArea = document.getElementById('formatted-output-area');
    const copyButton = document.getElementById('copy-output-btn');
    const downloadButton = document.getElementById('download-output-btn');
    const formattedReferencesCard = document.getElementById('formatted-references-section');
    const formattedReferencesDescription = document.getElementById('formatted-references-description');


    // --- Data Structures and Initial State ---
    let references = []; // Array to hold reference objects for data management
    let referenceIdCounter = 0;

    const referenceTypes = [
        { value: 'book', label: 'Book' },
        { value: 'journalArticle', label: 'Journal Article' },
        { value: 'website', label: 'Website' },
        { value: 'conferenceProceeding', label: 'Conference Proceeding' },
        // Add more types as needed, matching citationFormatter.js expectations
        // Additional types from citationFormatter.js to consider: 'journal', 'conference', 'thesis', 'report'
        // For simplicity, the UI mapping uses broader categories for now.
        // 'journalArticle' maps to 'journal' in formatter
        // 'conferenceProceeding' maps to 'conference' in formatter
    ];

    const citationFormats = [
        { value: 'ieee', label: 'IEEE' },
        { value: 'apa', label: 'APA 7th Edition' },
        { value: 'mla', label: 'MLA 9th Edition' },
        { value: 'chicago', label: 'Chicago 17th Edition' },
        { value: 'harvard', label: 'Harvard' }
    ];

    // --- Populate Select Dropdowns ---
    function populateSelect(selectElement, options) {
        if (!selectElement) return;
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            selectElement.appendChild(opt);
        });
    }

    populateSelect(citationFormatSelect, citationFormats);


    // --- Create Reference Element HTML ---
    function createReferenceElement(id) {
        const referenceDiv = document.createElement('div');
        referenceDiv.classList.add('reference-item', 'card');
        referenceDiv.dataset.id = id;
        referenceDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Reference ${id}</h3>
                <button class="remove-reference-btn contrast" data-ref-id="${id}" aria-label="Remove Reference ${id}">Remove Reference</button>
            </div>

            <div>
                <label for="ref-type-${id}">Reference Type:</label>
                <select id="ref-type-${id}" name="ref-type-${id}" class="ref-type-select">
                    <!-- Options will be populated by populateSelect -->
                </select>
            </div>

            <div>
                <label for="ref-year-${id}">Year:</label>
                <input type="number" id="ref-year-${id}" name="ref-year-${id}" placeholder="YYYY">
            </div>

            <div>
                <label for="ref-title-${id}">Title:</label>
                <input type="text" id="ref-title-${id}" name="ref-title-${id}" placeholder="Title of the work">
            </div>

            <div class="authors-section">
                <label>Authors:</label>
                <div id="authors-container-${id}" class="authors-container">
                    <!-- Author fields will be added here -->
                </div>
                <button class="add-author-btn" data-ref-id="${id}">Add Author</button>
            </div>

            <!-- Conditional Fields -->
            <div class="conditional-fields">
                <div class="field-group journal-conf-name-field" style="display: none;">
                    <label for="ref-journal-conf-${id}">Journal/Conference Name:</label>
                    <input type="text" id="ref-journal-conf-${id}" name="ref-journal-conf-${id}">
                </div>
                <div class="field-group publisher-field" style="display: none;">
                    <label for="ref-publisher-${id}">Publisher:</label>
                    <input type="text" id="ref-publisher-${id}" name="ref-publisher-${id}">
                </div>
                <div class="field-group volume-field" style="display: none;">
                    <label for="ref-volume-${id}">Volume:</label>
                    <input type="text" id="ref-volume-${id}" name="ref-volume-${id}">
                </div>
                <div class="field-group issue-field" style="display: none;">
                    <label for="ref-issue-${id}">Issue:</label>
                    <input type="text" id="ref-issue-${id}" name="ref-issue-${id}">
                </div>
                <div class="field-group pages-field" style="display: none;">
                    <label for="ref-pages-${id}">Pages (e.g., 10-15):</label>
                    <input type="text" id="ref-pages-${id}" name="ref-pages-${id}">
                </div>
                <div class="field-group url-field" style="display: none;">
                    <label for="ref-url-${id}">URL:</label>
                    <input type="url" id="ref-url-${id}" name="ref-url-${id}">
                </div>
                <div class="field-group doi-field" style="display: none;">
                    <label for="ref-doi-${id}">DOI:</label>
                    <input type="text" id="ref-doi-${id}" name="ref-doi-${id}">
                </div>
                 <div class="field-group access-date-field" style="display: none;">
                    <label for="ref-access-date-${id}">Access Date:</label>
                    <input type="date" id="ref-access-date-${id}" name="ref-access-date-${id}">
                </div>
            </div>
        `;
        populateSelect(referenceDiv.querySelector(`#ref-type-${id}`), referenceTypes);
        addAuthorField(id, referenceDiv.querySelector(`#authors-container-${id}`));
        return referenceDiv;
    }

    // --- Manage References ---
    function addReference() {
        referenceIdCounter++;
        // No need to manage a separate 'references' array for data if we read from DOM directly during generation

        const referenceElement = createReferenceElement(referenceIdCounter);
        referencesContainer.appendChild(referenceElement);

        referenceElement.querySelector('.ref-type-select').addEventListener('change', handleReferenceTypeChange);
        handleReferenceTypeChange({ target: referenceElement.querySelector('.ref-type-select') });
    }

    function removeReference(refId) {
        const refElement = referencesContainer.querySelector(`.reference-item[data-id="${refId}"]`);
        if (refElement) {
            refElement.remove();
        }
        // If all references are removed, add a new empty one
        if (referencesContainer.children.length === 0) {
            addReference();
        }
    }

    // --- Manage Authors ---
    function addAuthorField(refId, authorsDiv) {
        const authorId = authorsDiv.children.length + 1;
        const authorFieldDiv = document.createElement('div');
        authorFieldDiv.classList.add('author-input-group');
        authorFieldDiv.style.display = 'flex'; // Basic styling for alignment
        authorFieldDiv.style.gap = '10px'; // Space between input and button
        authorFieldDiv.innerHTML = `
            <input type="text" name="ref-author-${refId}-${authorId}" placeholder="Author Full Name" style="flex-grow: 1;">
            <button type="button" class="remove-author-btn contrast outline" aria-label="Remove this author">Remove</button>
        `;
        authorsDiv.appendChild(authorFieldDiv);
    }

    function removeAuthorField(buttonElement) {
        const authorFieldDiv = buttonElement.closest('.author-input-group');
        const parentContainer = authorFieldDiv.parentElement;
        if (parentContainer && parentContainer.querySelectorAll('.author-input-group').length > 1) {
            authorFieldDiv.remove();
        } else {
            // Clear the input field instead of removing it
            const inputField = authorFieldDiv.querySelector('input[type="text"]');
            if (inputField) {
                inputField.value = '';
            }
            // alert("Each reference must have at least one author field.");
        }
    }

    // --- Event Handlers ---
    if (addReferenceButton) {
        addReferenceButton.addEventListener('click', addReference);
    }

    referencesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-reference-btn')) {
            const refId = parseInt(event.target.dataset.refId);
            removeReference(refId);
        }
        if (event.target.classList.contains('add-author-btn')) {
            const refId = parseInt(event.target.dataset.refId);
            const authorsDiv = referencesContainer.querySelector(`#authors-container-${refId}`);
            addAuthorField(refId, authorsDiv);
        }
        if (event.target.classList.contains('remove-author-btn')) {
            removeAuthorField(event.target);
        }
    });

    function handleReferenceTypeChange(event) {
        const selectElement = event.target;
        const selectedType = selectElement.value;
        const referenceItem = selectElement.closest('.reference-item');
        if (!referenceItem) return;

        const conditionalFields = referenceItem.querySelector('.conditional-fields');
        conditionalFields.querySelectorAll('.field-group').forEach(fg => fg.style.display = 'none');

        // Simplified mapping based on current referenceTypes and citationFormatter.js
        if (selectedType === 'book') {
            conditionalFields.querySelector('.publisher-field').style.display = 'block';
            conditionalFields.querySelector('.doi-field').style.display = 'block'; // Books can have DOIs
        } else if (selectedType === 'journalArticle') { // Maps to 'journal' in formatter
            conditionalFields.querySelector('.journal-conf-name-field').style.display = 'block'; // Journal Name
            conditionalFields.querySelector('.volume-field').style.display = 'block';
            conditionalFields.querySelector('.issue-field').style.display = 'block';
            conditionalFields.querySelector('.pages-field').style.display = 'block';
            conditionalFields.querySelector('.doi-field').style.display = 'block';
        } else if (selectedType === 'website') {
            conditionalFields.querySelector('.url-field').style.display = 'block';
            conditionalFields.querySelector('.access-date-field').style.display = 'block';
            conditionalFields.querySelector('.publisher-field').style.display = 'block'; // Website can have a publisher (organization)
        } else if (selectedType === 'conferenceProceeding') { // Maps to 'conference' in formatter
            conditionalFields.querySelector('.journal-conf-name-field').style.display = 'block'; // Conference Name
            conditionalFields.querySelector('.pages-field').style.display = 'block';
            conditionalFields.querySelector('.publisher-field').style.display = 'block'; // Proceedings publisher
            conditionalFields.querySelector('.doi-field').style.display = 'block'; // Conference papers can have DOIs
        }
    }

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const collectedReferences = [];
            const referenceElements = referencesContainer.querySelectorAll('.reference-item');

            referenceElements.forEach(refElement => {
                const id = parseInt(refElement.dataset.id);
                let type = refElement.querySelector(`#ref-type-${id}`).value;
                const year = refElement.querySelector(`#ref-year-${id}`).value;
                const title = refElement.querySelector(`#ref-title-${id}`).value;

                const authorInputs = refElement.querySelectorAll(`#authors-container-${id} input[type="text"]`);
                const authors = Array.from(authorInputs).map(input => input.value.trim()).filter(name => name);

                // Map UI type to formatter type
                let formatterType = type;
                if (type === 'journalArticle') formatterType = 'journal';
                if (type === 'conferenceProceeding') formatterType = 'conference';


                const referenceData = {
                    type: formatterType, // Use mapped type for the formatter
                    title: title,
                    authors: authors,
                    year: year,
                    journal: refElement.querySelector(`#ref-journal-conf-${id}`)?.value,
                    publisher: refElement.querySelector(`#ref-publisher-${id}`)?.value,
                    volume: refElement.querySelector(`#ref-volume-${id}`)?.value,
                    issue: refElement.querySelector(`#ref-issue-${id}`)?.value,
                    pages: refElement.querySelector(`#ref-pages-${id}`)?.value,
                    url: refElement.querySelector(`#ref-url-${id}`)?.value,
                    doi: refElement.querySelector(`#ref-doi-${id}`)?.value,
                    accessDate: refElement.querySelector(`#ref-access-date-${id}`)?.value,
                };
                collectedReferences.push(referenceData);
            });

            const selectedFormat = citationFormatSelect.value;
            if (!selectedFormat || collectedReferences.length === 0) {
                formattedOutputArea.value = "Please select a citation format and add at least one reference with required fields.";
                formattedReferencesCard.style.display = 'block';
                return;
            }

            let outputString = "";
            // Ensure citationFormatter.js is loaded and formatCitation is available
            const formatterFunc = (typeof formatCitation === 'function') ? formatCitation : window.formatCitation;

            if (!formatterFunc) {
                formattedOutputArea.value = "ERROR: Citation formatting library not loaded correctly.";
                formattedReferencesCard.style.display = 'block';
                return;
            }

            collectedReferences.forEach((ref, index) => {
                if (!ref.title || !ref.year || ref.authors.length === 0) {
                    outputString += `Skipping reference ${index + 1} (missing title, year, or authors).\n\n`;
                    return; // Skip this reference
                }
                let formattedRef = formatterFunc(ref, selectedFormat);

                if (selectedFormat === 'ieee') {
                    outputString += `[${index + 1}] ${formattedRef}\n`;
                } else {
                    outputString += `${formattedRef}\n\n`;
                }
            });

            formattedOutputArea.value = outputString.trim();
            formattedReferencesDescription.textContent = `Your references in ${citationFormatSelect.options[citationFormatSelect.selectedIndex].text} format:`;
            formattedReferencesCard.style.display = 'block';
        });
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            if (formattedOutputArea.value) {
                navigator.clipboard.writeText(formattedOutputArea.value)
                    .then(() => {
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => copyButton.textContent = 'Copy', 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        alert('Failed to copy text. Your browser might not support this feature or permissions are denied.');
                    });
            }
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            const textToSave = formattedOutputArea.value;
            const selectedFormat = citationFormatSelect.value;
            if (textToSave) {
                const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `references_${selectedFormat || 'export'}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }
        });
    }

    // --- Initial Setup ---
    // Clear any static reference item from HTML if it's there.
    const staticReferenceItem = referencesContainer.querySelector('.reference-item:not([data-id])');
    if (staticReferenceItem) {
        staticReferenceItem.remove();
    }
    // If referencesContainer is empty after potential static clear, add one.
    if (referencesContainer.children.length === 0) {
         addReference(); // Add the first reference item dynamically
    }

    // Ensure the citationFormatter.js's exported function is available globally
    // This is a workaround for not using JS modules directly in the browser without a build step.
    // If citationFormatter.js uses `export const formatCitation`, it won't be global by default.
    // It should be included as a module in HTML: <script type="module" src="..."></script>
    // Or, for this environment, we might need to modify citationFormatter.js to attach its functions to `window`.
    // For now, the code above tries `window.formatCitation` or `formatCitation`.
    // If `citationFormatter.js` is: `export const formatCitation = ...;`
    // And `main.js` is loaded as a regular script, it can't directly access `formatCitation`.
    // Solution: Change `index.html` to load `citationFormatter.js` as a module and `main.js` as a module,
    // then use `import { formatCitation } from './citationFormatter.js';` in `main.js`.
    // OR, simpler for now: modify `citationFormatter.js` to do `window.formatCitation = ...`
});
