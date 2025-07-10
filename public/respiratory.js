document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    // Initialize Lymphadenopathy section
    initLymphadenopathy();

    // Define complaint-specific details
    const complaintDetails = {
        'Cough': [
            {
                label: 'Postural Variation',
                type: 'text',
                suggestions: [
                    'Worse when lying down',
                    'Worse when lying on right side',
                    'Worse when lying on left side',
                    'Worse when sitting up',
                    'Better when sitting up',
                    'No postural variation'
                ]
            },
            {
                label: 'Diurnal Variation',
                type: 'text',
                suggestions: [
                    'Worse in the morning',
                    'Worse at night',
                    'Worse in the evening',
                    'Worse throughout the day',
                    'No diurnal variation'
                ]
            }
        ],
        'Breathlessness': [
            {
                label: 'Initial MMRC Grade',
                type: 'select',
                options: [
                    'Grade 0 - Breathless only with strenuous exercise',
                    'Grade 1 - Short of breath when hurrying or walking up a slight hill',
                    'Grade 2 - Walks slower than people of same age due to breathlessness or stops for breath when walking at own pace',
                    'Grade 3 - Stops for breath after walking 100 meters or after few minutes',
                    'Grade 4 - Too breathless to leave house or breathless when dressing'
                ]
            },
            {
                label: 'Current MMRC Grade',
                type: 'select',
                options: [
                    'Grade 0 - Breathless only with strenuous exercise',
                    'Grade 1 - Short of breath when hurrying or walking up a slight hill',
                    'Grade 2 - Walks slower than people of same age due to breathlessness or stops for breath when walking at own pace',
                    'Grade 3 - Stops for breath after walking 100 meters or after few minutes',
                    'Grade 4 - Too breathless to leave house or breathless when dressing'
                ]
            },
            {
                label: 'Orthopnea and PND',
                type: 'checkboxes',
                options: [
                    { value: 'no_orthopnea', label: 'No Orthopnea' },
                    { value: 'no_pnd', label: 'No PND' }
                ]
            },
            {
                label: 'Postural Variation',
                type: 'text',
                suggestions: [
                    'Orthopnea present',
                    'Better in sitting position',
                    'Better in standing position',
                    'Worse when lying flat',
                    'Worse on exertion',
                    'No postural variation'
                ]
            },
            {
                label: 'Diurnal Variation',
                type: 'text',
                suggestions: [
                    'Worse at night (Paroxysmal Nocturnal Dyspnea)',
                    'Worse in the morning',
                    'Worse in the evening',
                    'Worse throughout the day',
                    'No diurnal variation'
                ]
            }
        ],
        'Chest Pain': [
            {
                label: 'Location',
                type: 'text',
                suggestions: [
                    'Left side of chest',
                    'Right side of chest',
                    'Central chest',
                    'Retrosternal',
                    'Precordial',
                    'Left mammary region',
                    'Right mammary region',
                    'Left infra-axillary region',
                    'Right infra-axillary region',
                    'Left infra-scapular region',
                    'Right infra-scapular region'
                ]
            },
            {
                label: 'Radiation',
                type: 'text',
                suggestions: [
                    'Left shoulder',
                    'Right shoulder',
                    'Left arm',
                    'Right arm',
                    'Back',
                    'Neck',
                    'Jaw',
                    'Epigastric region',
                    'No radiation'
                ]
            }
        ]
    };

    // Handle menstrual history section visibility based on gender
    const sexSelect = document.getElementById('sex');
    const menstrualHistorySection = document.getElementById('menstrualHistorySection');
    const menstrualHistory = document.getElementById('menstrualHistory');

    // Normal menstrual history text
    const normalMenstrualHistory = "Regular menstrual cycles occurring every 28-30 days with 4-5 days of flow, using 2-3 pads per day. No significant abdominal pain, no passage of clots, and no bleeding in the intermenstrual period. Last menstrual period was regular.";

    if (sexSelect && menstrualHistorySection) {
        // Initial check
        menstrualHistorySection.style.display = sexSelect.value === 'female' ? 'block' : 'none';
        if (sexSelect.value === 'female') {
            menstrualHistory.value = normalMenstrualHistory;
        }

        // Listen for changes
        sexSelect.addEventListener('change', () => {
            menstrualHistorySection.style.display = sexSelect.value === 'female' ? 'block' : 'none';
            if (sexSelect.value === 'female') {
                menstrualHistory.value = normalMenstrualHistory;
            }
        });
    }

    // Get all required elements
    const form = document.getElementById('caseSheetForm');
    const selectedComplaints = document.getElementById('selectedComplaints');
    const addCustomComplaintBtn = document.getElementById('addCustomComplaint');
    const outputSection = document.getElementById('outputSection');
    const caseSheetOutput = document.getElementById('caseSheetOutput');
    const caseSheetContent = document.getElementById('caseSheetContent');
    const generateBtn = document.getElementById('generateBtn');
    const editBtn = document.getElementById('editBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const tabHeader = document.getElementById('tabHeader');
    const tabContents = document.getElementById('tabContents');
    const addHistoryTab = document.getElementById('addHistoryTab');
    const complaintHistoryDialog = document.getElementById('complaintHistoryDialog');

    console.log('Elements found:', {
        form: !!form,
        selectedComplaints: !!selectedComplaints,
        outputSection: !!outputSection,
        generateBtn: !!generateBtn,
        editBtn: !!editBtn,
        downloadBtn: !!downloadBtn
    });

    // Track active complaints and their tabs
    const activeComplaints = new Set();

    // Handle complaint selection
    document.querySelectorAll('.complaint-item').forEach(item => {
        item.addEventListener('click', () => {
            const complaint = item.dataset.complaint;
            if (!activeComplaints.has(complaint)) {
                addSelectedComplaint(complaint);
            }
        });
    });

    // Add selected complaint
    function addSelectedComplaint(complaint) {
        const complaintDiv = document.createElement('div');
        complaintDiv.className = 'selected-complaint';
        complaintDiv.innerHTML = `
            <button type="button" class="remove-complaint" title="Remove complaint">×</button>
            <div class="complaint-header">
                <span class="complaint-name">${complaint}</span>
                <div class="duration-input">
                    <input type="number" class="complaint-duration-number" min="1" required>
                    <select class="complaint-duration-unit">
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>
                </div>
            </div>
        `;

        selectedComplaints.appendChild(complaintDiv);
        activeComplaints.add(complaint);

        // Add remove functionality
        complaintDiv.querySelector('.remove-complaint').addEventListener('click', () => {
            complaintDiv.remove();
            activeComplaints.delete(complaint);
            // Remove corresponding history tab if exists
            const tabId = 'tab-' + complaint.toLowerCase().replace(/\s+/g, '-');
            const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
            if (tabButton) {
                const tabContent = document.getElementById(tabId);
                tabButton.remove();
                tabContent.remove();
            }
        });

        // Add complaint tab in history section
        addComplaintTab(complaint);

        // Add auto-fill functionality for duration
        const durationNumber = complaintDiv.querySelector('.complaint-duration-number');
        const durationUnit = complaintDiv.querySelector('.complaint-duration-unit');
        const tabId = 'tab-' + complaint.toLowerCase().replace(/\s+/g, '-');

        const updateHistoryDuration = () => {
            const historyDurationInput = document.querySelector(`input[name="${tabId}_duration"]`);
            if (historyDurationInput && durationNumber.value) {
                historyDurationInput.value = `${durationNumber.value} ${durationUnit.value}`;
            }
        };

        durationNumber.addEventListener('input', updateHistoryDuration);
        durationUnit.addEventListener('change', updateHistoryDuration);
    }

    // Add custom complaint
    if (addCustomComplaintBtn) {
    addCustomComplaintBtn.addEventListener('click', () => {
        const complaint = prompt('Enter complaint:');
        if (complaint && !activeComplaints.has(complaint)) {
            addSelectedComplaint(complaint);
        }
    });
    }

    // Show complaint history dialog
    if (addHistoryTab) {
    addHistoryTab.addEventListener('click', () => {
        complaintHistoryDialog.style.display = 'flex';
    });
    }

    // Close complaint history dialog
    window.closeComplaintDialog = function() {
        complaintHistoryDialog.style.display = 'none';
    };

    // Handle complaint option selection from dialog
    document.querySelectorAll('.complaint-option').forEach(option => {
        option.addEventListener('click', () => {
            let complaint = option.dataset.complaint;
            if (complaint === 'Other') {
                complaint = prompt('Enter complaint:');
                if (!complaint) return;
            }
            addComplaintTab(complaint);
            closeComplaintDialog();
        });
    });

    // Add complaint tab
    function addComplaintTab(complaint) {
        const tabId = 'tab-' + complaint.toLowerCase().replace(/\s+/g, '-');
        
        // Don't create duplicate tabs
        if (document.getElementById(tabId)) return;
        
        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.type = 'button';
        tabButton.className = 'tab-button';
        tabButton.innerHTML = `
            ${complaint}
            <button type="button" class="remove-tab" title="Remove complaint history">×</button>
        `;
        tabButton.dataset.tab = tabId;
        tabButton.dataset.complaint = complaint;
        
        // Insert before the add button
        tabHeader.insertBefore(tabButton, addHistoryTab);

        // Create tab content
        const tabContent = document.createElement('div');
        tabContent.id = tabId;
        tabContent.className = 'tab-content';
        tabContent.dataset.complaint = complaint;

        // Standard fields for all complaints
        let standardFields = `
            <div class="form-group">
                <label>Duration:</label>
                <input type="text" name="${tabId}_duration" placeholder="[eg: 5 days]" required>
            </div>
            <div class="form-group">
                <label>Onset:</label>
                <div class="radio-group">
                    <label><input type="radio" name="${tabId}_onset" value="sudden"> Sudden</label>
                    <label><input type="radio" name="${tabId}_onset" value="insidious" checked> Insidious</label>
                </div>
            </div>
            <div class="form-group">
                <label>Progression:</label>
                <div class="radio-group">
                    <label><input type="radio" name="${tabId}_progression" value="progressive" checked> Progressive</label>
                    <label><input type="radio" name="${tabId}_progression" value="stationary"> Stationary</label>
                    <label><input type="radio" name="${tabId}_progression" value="regressive"> Regressive</label>
                </div>
            </div>`;

        // Add complaint-specific fields if they exist
        if (complaintDetails[complaint]) {
            complaintDetails[complaint].forEach(detail => {
                if (detail.type === 'select') {
                    standardFields += `
                        <div class="form-group">
                            <label>${detail.label}:</label>
                            <select name="${tabId}_${detail.label.toLowerCase().replace(/\s+/g, '_')}">
                                <option value="">Select ${detail.label.toLowerCase()}</option>
                                ${detail.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                            </select>
                        </div>`;
                } else if (detail.type === 'checkboxes') {
                    standardFields += `
                        <div class="form-group">
                            <label>${detail.label}:</label>
                            <div class="checkbox-group">
                                ${detail.options.map(option => `
                                    <label><input type="checkbox" name="${tabId}_${option.value}"> ${option.label}</label>
                                `).join('')}
            </div>
                        </div>`;
                } else {
                    standardFields += `
                        <div class="form-group">
                            <label>${detail.label}:</label>
                            <input type="text" name="${tabId}_${detail.label.toLowerCase().replace(/\s+/g, '_')}" 
                                   class="suggestion-input" 
                                   placeholder="Enter ${detail.label.toLowerCase()}" 
                                   list="${tabId}_${detail.label.toLowerCase().replace(/\s+/g, '_')}_suggestions">
                            <datalist id="${tabId}_${detail.label.toLowerCase().replace(/\s+/g, '_')}_suggestions">
                                ${detail.suggestions.map(suggestion => `<option value="${suggestion}">`).join('')}
                            </datalist>
                        </div>`;
                }
            });
        }

        standardFields += `
            <div class="form-group">
                <label>Aggravating Factors:</label>
                <input type="text" name="${tabId}_aggravating_factors" class="suggestion-input" placeholder="Enter aggravating factors" list="${tabId}_aggravating_suggestions">
                <datalist id="${tabId}_aggravating_suggestions">
                    <option value="Exercise">
                    <option value="Cold exposure">
                    <option value="Dust exposure">
                    <option value="Smoke exposure">
                    <option value="Lying down">
                    <option value="Physical activity">
                </datalist>
            </div>
            <div class="form-group">
                <label>Relieving Factors:</label>
                <input type="text" name="${tabId}_relieving_factors" class="suggestion-input" placeholder="Enter relieving factors" list="${tabId}_relieving_suggestions">
                <datalist id="${tabId}_relieving_suggestions">
                    <option value="Rest">
                    <option value="Sitting position">
                    <option value="Standing position">
                    <option value="Medications">
                    <option value="Steam inhalation">
                    <option value="Deep breathing">
                </datalist>
            </div>
            <div class="form-group">
                <label>Associated Symptoms:</label>
                <input type="text" name="${tabId}_associated_symptoms" class="suggestion-input" placeholder="Enter associated symptoms" list="${tabId}_associated_suggestions">
                <datalist id="${tabId}_associated_suggestions">
                    <option value="Fever">
                    <option value="Chest pain">
                    <option value="Breathlessness">
                    <option value="Palpitations">
                    <option value="Sweating">
                    <option value="Fatigue">
                    <option value="Loss of appetite">
                    <option value="Loss of weight">
                </datalist>
                            </div>
            <div class="form-group">
                <label>Additional Notes:</label>
                <textarea name="${tabId}_additional_notes" rows="3" placeholder="Enter any additional details about the complaint"></textarea>
            </div>`;

        tabContent.innerHTML = standardFields;
        tabContents.appendChild(tabContent);

        // Add click handler for the tab
        tabButton.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-tab')) {
            tabButton.remove();
            tabContent.remove();
                return;
            }
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show selected tab content
            tabContent.style.display = 'block';
            
            // Update active state of tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            tabButton.classList.add('active');
        });

        // Trigger click to show the new tab
        tabButton.click();
    }

    // Close dialog when clicking outside
    complaintHistoryDialog.addEventListener('click', function(e) {
        if (e.target === this) {
            closeComplaintDialog();
        }
    });

    // Handle negative history toggles
    ['tb', 'cvs', 'malignancy'].forEach(type => {
        const toggle = document.getElementById(`${type}History`);
        const details = document.getElementById(`${type}HistoryDetails`);
        
        if (toggle && details) {
            toggle.addEventListener('change', () => {
                details.style.display = toggle.checked ? 'block' : 'none';
            });
        }
    });

    // Add warning before page refresh/close
    let formModified = false;
    
    // Track form changes
    document.getElementById('caseSheetForm').addEventListener('change', () => {
        formModified = true;
    });
    
    // Add warning before closing/refreshing
    window.addEventListener('beforeunload', (e) => {
        if (formModified) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    });

    // Reset form modified state when generating case sheet
    if (document.getElementById('generateBtn')) {
        document.getElementById('generateBtn').addEventListener('click', () => {
            formModified = false;
        });
    }

    // Initialize all components
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize general examination
        initGeneralExamination();

        // Initialize vitals
        initVitals();

        // Add event listeners for history buttons
        document.querySelectorAll('.add-history-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.closest('.section').querySelector('h3').textContent.includes('Past')) {
                    addPastHistory();
                } else if (this.closest('.section').querySelector('h3').textContent.includes('Family')) {
                    addFamilyHistory();
                } else if (this.closest('.section').querySelector('h3').textContent.includes('Treatment')) {
                    addTreatmentHistory();
                }
            });
        });

        // Setup generate case sheet functionality
        const generateBtn = document.getElementById('generateBtn');
        const outputSection = document.getElementById('outputSection');
        const caseSheetForm = document.getElementById('caseSheetForm');
        const editBtn = document.getElementById('editBtn');

    if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                try {
                    // Hide the form
                    caseSheetForm.style.display = 'none';
                    
                    // Show the output section
                    outputSection.style.display = 'block';

                    // Generate the case sheet content
                    const caseSheetContent = generateCaseSheet();
                    
                    // Display the content
                    document.getElementById('caseSheetContent').innerHTML = caseSheetContent;
            } catch (error) {
                console.error('Error generating case sheet:', error);
                    // Show error message to user
                    alert('Error generating case sheet. Please check all required fields are filled.');
                    // Revert display states
                    caseSheetForm.style.display = 'block';
                    outputSection.style.display = 'none';
            }
        });
    }

    if (editBtn) {
            editBtn.addEventListener('click', function() {
                // Show the form
                caseSheetForm.style.display = 'block';
                
                // Hide the output section
        outputSection.style.display = 'none';
        });
    }

        // Initialize Lymphadenopathy section
        initLymphadenopathy();
    });

    // Download button handler
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            console.log('Download button clicked');
            const content = caseSheetContent.textContent;
            const patientName = document.getElementById('name').value.trim() || 'patient';
            const date = new Date().toISOString().split('T')[0];
            
            try {
                // Create PDF
                const doc = new jspdf.jsPDF();
                
                // Set initial styles
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('RESPIRATORY SYSTEM CASE SHEET', 105, 15, { align: 'center' });
                
                // Add date and time
                doc.setFontSize(10);
                doc.setFont('helvetica', 'italic');
                doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });
                
                // Add content with word wrapping
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                
                const splitText = doc.splitTextToSize(content, 180);
                let y = 30;
                
                splitText.forEach(line => {
                    if (y > 280) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(line, 15, y);
                    y += 7;
                });
                
                // Save the PDF
                doc.save(`${patientName}_respiratory_case_sheet_${date}.pdf`);
                console.log('PDF generated and downloaded');
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        });
    }

    // Handle past history clickable items
    const pastHistoryList = document.querySelector('.past-history-list');
    document.querySelectorAll('.clickable-item').forEach(item => {
        item.addEventListener('click', () => {
            const historyType = item.dataset.history;
            let additionalFields = '';
            let historyTitle = item.textContent;

            // Define specific fields based on history type
            switch(historyType) {
                case 'previous_episodes':
                    additionalFields = `
                        <div class="form-group">
                            <label>When was the last episode?</label>
                            <input type="text" class="history-duration" placeholder="e.g., 6 months ago">
                        </div>
                        <div class="form-group">
                            <label>Duration of episode:</label>
                            <input type="text" class="episode-duration" placeholder="e.g., 2 weeks">
                        </div>
                    `;
                    break;
                case 'dm_ht_ba':
                    additionalFields = `
                        <div class="form-group">
                            <div class="checkbox-group">
                                <label><input type="checkbox" class="condition-check" data-condition="DM"> Diabetes Mellitus</label>
                                <label><input type="checkbox" class="condition-check" data-condition="HT"> Hypertension</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Duration:</label>
                            <input type="text" class="history-duration" placeholder="How long have they had these conditions?">
                        </div>
                    `;
                    break;
                case 'custom':
                    historyTitle = 'Custom History';
                    additionalFields = `
                        <div class="form-group">
                            <label>Condition Name:</label>
                            <input type="text" class="form-control custom-condition" placeholder="Enter condition name">
                        </div>
                        <div class="form-group">
                            <label>Duration:</label>
                            <input type="text" class="history-duration" placeholder="How long has this condition been present?">
                        </div>
                        <div class="form-group">
                            <label>Details:</label>
                            <textarea class="form-control custom-details" placeholder="Enter condition details"></textarea>
                        </div>
                    `;
                    break;
                case 'tb':
                    additionalFields = `
                        <div class="form-group">
                            <label>Contact History:</label>
                            <select class="contact-history">
                                <option value="no">No known contact</option>
                                <option value="family">Family member</option>
                                <option value="workplace">Workplace contact</option>
                                <option value="other">Other contact</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Age when affected:</label>
                            <input type="text" class="age-affected" placeholder="Age when TB occurred">
                        </div>
                        <div class="form-group">
                            <label>Treatment Status:</label>
                            <select class="treatment-status">
                                <option value="">Select status</option>
                                <option value="completed">Completed</option>
                                <option value="not_completed">Not Completed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    `;
                    break;
                case 'aspiration':
                    additionalFields = `
                        <div class="form-group">
                            <label>ABCDEF Factors:</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox"> Aspiration</label>
                                <label><input type="checkbox"> Booze</label>
                                <label><input type="checkbox"> Cough</label>
                                <label><input type="checkbox"> Drowning</label>
                                <label><input type="checkbox"> Epilepsy</label>
                                <label><input type="checkbox"> Foreign Body</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>When did it occur?</label>
                            <input type="text" class="occurrence-time" placeholder="When did the aspiration occur?">
                        </div>
                    `;
                    break;
                case 'asthma':
                    additionalFields = `
                        <div class="form-group">
                            <label>Duration:</label>
                            <input type="text" class="history-duration" placeholder="How long have they had asthma?">
                        </div>
                        <div class="form-group">
                            <label>Treatment Status:</label>
                            <select class="treatment-status">
                                <option value="controlled">Well Controlled</option>
                                <option value="partially">Partially Controlled</option>
                                <option value="uncontrolled">Uncontrolled</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Current Medications:</label>
                            <textarea class="medications" placeholder="List current medications"></textarea>
                        </div>
                    `;
                    break;
                case 'seizures':
                    additionalFields = `
                        <div class="form-group">
                            <label>Duration:</label>
                            <input type="text" class="history-duration" placeholder="How long have they had seizures?">
                        </div>
                        <div class="form-group">
                            <label>Last Episode:</label>
                            <input type="text" class="last-episode" placeholder="When was the last episode?">
                        </div>
                        <div class="form-group">
                            <label>Current Medications:</label>
                            <textarea class="medications" placeholder="List current medications"></textarea>
                        </div>
                    `;
                    break;
                case 'surgery':
                    additionalFields = `
                        <div class="form-group">
                            <label>Type of Surgery:</label>
                            <input type="text" class="surgery-type" placeholder="What surgery was performed?">
                        </div>
                        <div class="form-group">
                            <label>When:</label>
                            <input type="text" class="surgery-date" placeholder="When was the surgery performed?">
                        </div>
                        <div class="form-group">
                            <label>Details:</label>
                            <textarea class="surgery-details" placeholder="Additional details about the surgery"></textarea>
                        </div>
                    `;
                    break;
                case 'blood_transfusion':
                    additionalFields = `
                        <div class="form-group">
                            <label>When:</label>
                            <input type="text" class="transfusion-date" placeholder="When was the transfusion?">
                        </div>
                        <div class="form-group">
                            <label>Reason:</label>
                            <input type="text" class="transfusion-reason" placeholder="Why was transfusion needed?">
                        </div>
                        <div class="form-group">
                            <label>Details:</label>
                            <textarea class="transfusion-details" placeholder="Additional details about the transfusion"></textarea>
                        </div>
                    `;
                    break;
                default:
                    additionalFields = `
                        <div class="form-group">
                            <label>When:</label>
                            <input type="text" class="history-duration" placeholder="When did it occur?">
                        </div>
                        <div class="form-group">
                            <label>Details:</label>
                            <textarea class="condition-details" placeholder="Enter additional details"></textarea>
                        </div>
                    `;
            }

            const historyItem = document.createElement('div');
            historyItem.className = 'past-history-item';
            historyItem.innerHTML = `
                <div class="history-header">
                    <span class="history-title">${historyTitle}</span>
                    <button type="button" class="remove-history" title="Remove history">×</button>
                </div>
                <div class="history-details">
                    ${additionalFields}
                </div>
            `;

            // Add remove functionality
            historyItem.querySelector('.remove-history').addEventListener('click', () => {
                historyItem.remove();
                formModified = true;
            });

            // Add change tracking
            historyItem.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('change', () => {
                    formModified = true;
                });
            });

            pastHistoryList.appendChild(historyItem);
            formModified = true;
        });
    });

    // Treatment History Handling
    const noTreatmentHistory = document.getElementById('noTreatmentHistory');
    const treatmentHistory = document.getElementById('treatmentHistory');

    if (noTreatmentHistory && treatmentHistory) {
        noTreatmentHistory.addEventListener('change', () => {
            treatmentHistory.disabled = noTreatmentHistory.checked;
            if (noTreatmentHistory.checked) {
                treatmentHistory.value = '';
            }
        });

        treatmentHistory.addEventListener('input', () => {
            if (treatmentHistory.value.trim() !== '') {
                noTreatmentHistory.checked = false;
            }
        });
    }
});

// Complaint templates
const complaintDetails = {
    'Cough': [
        { label: 'Pattern', type: 'radio', options: ['Continuous', 'Intermittent'] },
        { label: 'Severity', type: 'radio', options: ['Mild', 'Moderate', 'Severe'] }
    ],
    'Breathlessness': [
        { label: 'Grade', type: 'select', options: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'] },
        { label: 'Pattern', type: 'radio', options: ['Continuous', 'Intermittent'] },
        { label: 'Severity', type: 'radio', options: ['Mild', 'Moderate', 'Severe'] }
    ],
    'Fever': [
        { label: 'Pattern', type: 'radio', options: ['Continuous', 'Intermittent', 'Remittent'] },
        { label: 'Severity', type: 'radio', options: ['Mild', 'Moderate', 'High grade'] }
    ],
    'Wheeze': [
        { label: 'Pattern', type: 'radio', options: ['Continuous', 'Intermittent'] },
        { label: 'Severity', type: 'radio', options: ['Mild', 'Moderate', 'Severe'] }
    ]
};

// Past History Management
const pastHistoryItems = [
    "H/O previous similar episodes",
    "H/O DM, HT, BA",
    "H/O TB(Any contact, Age, Treatment failure)",
    "H/O suggestive of pneumonia",
    "Aspiration( Aspiration, Booze, Cough, Drowning, Epilepsy, Foreign Body- ABCDEF)",
    "Exanthematous fever",
    "Tooth extraction, Tonsillectomy, Allergy",
    "Trauma",
    "Exposure to STD's",
    "General anaesthesia",
    "H/O suggestive of Pleural effusion",
    "Acute abdominal distress( Subphrenic abscess, Amoebic abscess, Pancreatitis)",
    "H/O suggestive of past infections",
    "Measles, whooping cough",
    "Recurrent respiratory infection"
];

function addPastHistory() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>Add Past History</h3>
            <div class="predefined-complaints">
                <select id="pastHistorySelect" class="complaint-select">
                    <option value="">Select Past History</option>
                    ${pastHistoryItems.map(item => `<option value="${item}">${item}</option>`).join('')}
                </select>
            </div>
            <div class="custom-complaint">
                <input type="text" id="pastHistoryInput" placeholder="Or enter custom past history">
            </div>
            <div class="dialog-actions">
                <button onclick="this.closest('dialog').close()">Cancel</button>
                <button onclick="savePastHistory(this.closest('dialog'))">Add</button>
            </div>
        </div>
    `;

    const select = dialog.querySelector('#pastHistorySelect');
    const input = dialog.querySelector('#pastHistoryInput');

    select.addEventListener('change', () => {
        input.value = select.value;
    });

    document.body.appendChild(dialog);
    dialog.showModal();
}

function savePastHistory(dialog) {
    const input = dialog.querySelector('#pastHistoryInput');
    const text = input.value.trim();
    if (text) {
        const list = document.querySelector('.past-history-list');
        const item = document.createElement('div');
        item.className = 'past-history-item';
        item.innerHTML = `
            ${text}
            <button onclick="this.parentElement.remove()" class="remove-tab">×</button>
        `;
        list.appendChild(item);
    }
    dialog.close();
}

// Family History Management
const familyHistoryItems = [
    "Any other family members with similar complaints",
    "H/O TB"
];

function addFamilyHistory() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>Add Family History</h3>
            <div class="predefined-complaints">
                <select id="familyHistorySelect" class="complaint-select">
                    <option value="">Select Family History</option>
                    ${familyHistoryItems.map(item => `<option value="${item}">${item}</option>`).join('')}
                </select>
            </div>
            <div class="custom-complaint">
                <input type="text" id="familyHistoryInput" placeholder="Or enter custom family history">
            </div>
            <div class="dialog-actions">
                <button onclick="this.closest('dialog').close()">Cancel</button>
                <button onclick="saveFamilyHistory(this.closest('dialog'))">Add</button>
            </div>
        </div>
    `;

    const select = dialog.querySelector('#familyHistorySelect');
    const input = dialog.querySelector('#familyHistoryInput');

    select.addEventListener('change', () => {
        input.value = select.value;
    });

    document.body.appendChild(dialog);
    dialog.showModal();
}

function saveFamilyHistory(dialog) {
    const input = dialog.querySelector('#familyHistoryInput');
    const text = input.value.trim();
    if (text) {
        const list = document.querySelector('.family-history-list');
        const item = document.createElement('div');
        item.className = 'past-history-item';
        item.innerHTML = `
            ${text}
            <button onclick="this.parentElement.remove()" class="remove-tab">×</button>
        `;
        list.appendChild(item);
    }
    dialog.close();
}

// Treatment History Management
function initTreatmentHistory() {
    const checkbox = document.getElementById('hasTreatmentHistory');
    const historyList = document.querySelector('.treatment-history-list');
    
    checkbox.addEventListener('change', function() {
        historyList.classList.toggle('active', !this.checked);
    });
}

function addTreatmentHistory() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>Add Treatment History</h3>
            <textarea id="treatmentHistoryInput" placeholder="Enter treatment details" rows="4"></textarea>
            <div class="dialog-actions">
                <button onclick="this.closest('dialog').close()">Cancel</button>
                <button onclick="saveTreatmentHistory(this.closest('dialog'))">Add</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
}

function saveTreatmentHistory(dialog) {
    const input = dialog.querySelector('#treatmentHistoryInput');
    const text = input.value.trim();
    if (text) {
        const list = document.querySelector('.treatment-history-list');
        const item = document.createElement('div');
        item.className = 'treatment-item';
        item.innerHTML = `
            ${text}
            <button onclick="this.parentElement.remove()" class="remove-tab">×</button>
        `;
        list.insertBefore(item, list.lastElementChild);
    }
    dialog.close();
}

// General Examination Management
function initGeneralExamination() {
    const examItems = {
        'afebrile': '#feverDetails',
        'pallor': '#pallorDetails',
        'jaundice': '#jaundiceDetails',
        'clubbing': '#clubbingDetails',
        'cyanosis': '#cyanosisDetails',
        'pedalEdema': '#edemaDetails',
        'lymphadenopathy': '#lymphDetails'
    };

    for (const [name, detailsId] of Object.entries(examItems)) {
        const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
        const details = document.querySelector(detailsId);

        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'Present' || (name === 'afebrile' && this.value === 'No')) {
                    details.classList.add('active');
                } else {
                    details.classList.remove('active');
                }
            });
        });
    }
}

function safeSetValue(selector, value) {
    // Find all matching elements within the specific section
    const element = document.querySelector(selector);
    if (element) {
        element.value = value;
        // Remove any validation messages
        element.setCustomValidity('');
        element.reportValidity();
    }
}

function autofillInspection() {
    // Upper Respiratory Tract
    const upperRespiratoryCheckboxes = [
        'nose_contour',
        'nasal_septum',
        'nasal_polyp',
        'sinus',
        'teeth_staining',
        'dental_caries',
        'pharyngeal_wall'
    ];

    upperRespiratoryCheckboxes.forEach(name => {
        const checkbox = document.querySelector(`input[name="${name}"]`);
        if (checkbox) checkbox.checked = true;
    });

    // Lower Respiratory Tract
    const lowerRespiratoryCheckboxes = [
        'chest_symmetry',
        'spine_deformity',
        'clavicular_hallowing',
        'shoulder_drooping',
        'trachea_midline',
        'apical_impulse',
        'no_abnormal_findings'
    ];

    lowerRespiratoryCheckboxes.forEach(name => {
        const checkbox = document.querySelector(`input[name="${name}"]`);
        if (checkbox) checkbox.checked = true;
    });

    // Set chest movement to normal
    const normalChestMovement = document.querySelector('input[name="chest_movement"][value="normal"]');
    if (normalChestMovement) normalChestMovement.checked = true;
}

// Vitals Management
function initVitals() {
    const o2SupportRadios = document.querySelectorAll('input[name="o2Support"]');
    const o2SupportDetails = document.getElementById('o2SupportDetails');

    o2SupportRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            o2SupportDetails.style.display = this.value === 'No' ? 'block' : 'none';
        });
    });
}

// Function to autofill vitals with normal values
function autofillVitals() {
    // Helper function to check a radio button
    function checkRadio(name, value) {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        }
    }

    // Set numeric values
    document.getElementById('pulseRate').value = '76';
    
    // Set blood pressure
    const bpInputs = document.querySelectorAll('.vital-item:nth-child(2) input[type="number"]');
    if (bpInputs.length >= 2) {
        bpInputs[0].value = '120'; // Systolic
        bpInputs[1].value = '80';  // Diastolic
    }

    // Set temperature
    const tempInput = document.querySelector('.vital-item:nth-child(3) input[type="number"]');
    if (tempInput) tempInput.value = '98.6';

    // Set SpO2
    const spo2Input = document.querySelector('.vital-item:nth-child(4) input[type="number"]');
    if (spo2Input) spo2Input.value = '98';

    // Set Respiratory Rate
    document.getElementById('respiratoryRate').value = '16';

    // Set JVP
    document.getElementById('jvpValue').value = '8';

    // Check all radio buttons with normal values
    const normalValues = {
        // Pulse
        'pulseRate': 'Regular',
        'pulseRhythm': 'Regular',
        'pulseVolume': 'Normal',
        'vesselWall': 'Normal',
        'radioRadial': 'Absent',
        'radioFemoral': 'Absent',
        'peripheralVessels': 'Felt equally in all vessels',
        
        // Blood Pressure
        'bpPosition': 'Sitting',
        'bpArm': 'Right',
        
        // Temperature
        'tempMethod': 'Oral',
        
        // SpO2
        'o2Support': 'Yes',

        // Respiratory Rate
        'respiratoryPattern': 'Regular',
        'respiratoryDepth': 'Normal',
        
        // JVP
        'jvpCharacter': 'normal'
    };

    // Set all radio buttons
    Object.entries(normalValues).forEach(([name, value]) => {
        checkRadio(name, value);
    });
}

function initLymphadenopathy() {
    const radioButtons = document.querySelectorAll('input[name="lymphadenopathy"]');
    const lymphNodeDetails = document.getElementById('lymphNodeDetails');

    if (!radioButtons.length || !lymphNodeDetails) {
        console.error('Lymphadenopathy elements not found');
        return;
    }

    console.log('Initializing Lymphadenopathy section');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('Lymphadenopathy radio changed:', this.value);
            lymphNodeDetails.style.display = this.value === 'yes' ? 'block' : 'none';
            
            if (this.value === 'no') {
                // Clear all selections when "No Significant Lymphadenopathy" is selected
                document.querySelectorAll('input[name="lymphNodes"]').forEach(cb => cb.checked = false);
                document.getElementById('lymphNodeType').value = '';
                document.getElementById('lymphNodeSize').value = '';
                Array.from(document.getElementById('lymphNodeCharacteristics').options)
                    .forEach(opt => opt.selected = false);
            }
        });
    });

    // Set initial state
    const checkedRadio = document.querySelector('input[name="lymphadenopathy"]:checked');
    if (checkedRadio) {
        lymphNodeDetails.style.display = checkedRadio.value === 'yes' ? 'block' : 'none';
    }
}

// Update the autofill function
function autofillGeneralExam() {
    // Handle radio button groups first
    const radioSettings = {
        'Consciousness': 'Conscious, well oriented to time, place and person',
        'General Condition': 'Comfortable at rest',
        'Temperature': 'Afebrile',
        'Built and Nutrition': 'Well built and nourished'
    };

    Object.entries(radioSettings).forEach(([heading, value]) => {
        const examItem = Array.from(document.querySelectorAll('.exam-item'))
            .find(item => {
                const h4 = item.querySelector('h4');
                return h4 && h4.textContent.trim() === heading;
            });
        
        if (examItem) {
            const radio = Array.from(examItem.querySelectorAll('input[type="radio"]'))
                .find(input => {
                    const label = input.parentElement;
                    return label && label.textContent.trim() === value;
                });
            if (radio) radio.checked = true;
        }
    });

    // Handle select elements
    const examItems = document.querySelectorAll('.exam-item');
    examItems.forEach(item => {
        const h4 = item.querySelector('h4');
        if (!h4) return; // Skip if no h4 element

        const heading = h4.textContent.trim();
        const select = item.querySelector('.exam-select');
        
        if (!select) return; // Skip if no select element

        switch(heading) {
            case 'Pallor':
                select.value = 'no';
                break;
            case 'Jaundice':
                select.value = 'no';
                break;
            case 'Clubbing':
                select.value = 'no';
                break;
            case 'Cyanosis':
                select.value = 'no';
                break;
            case 'Pedal Edema':
                const mainSelect = item.querySelectorAll('.exam-select')[0];
                const typeSelect = item.querySelectorAll('.exam-select')[1];
                if (mainSelect) mainSelect.value = 'no';
                if (typeSelect) typeSelect.value = 'pitting';
                break;
            case 'Lymphadenopathy':
                if (select.multiple) {
                    // Deselect all options first
                    Array.from(select.options).forEach(opt => opt.selected = false);
                    // Select "No Significant Lymphadenopathy"
                    const noLymphOption = Array.from(select.options)
                        .find(opt => opt.value === 'no');
                    if (noLymphOption) noLymphOption.selected = true;
                }
                break;
            case 'Halitosis':
                select.value = 'no';
                break;
        }
    });

    // Lymphadenopathy
    const noLymphRadio = document.querySelector('input[name="lymphadenopathy"][value="no"]');
    if (noLymphRadio) {
        noLymphRadio.checked = true;
        noLymphRadio.dispatchEvent(new Event('change'));
        // Clear all checkboxes
        document.querySelectorAll('input[name="lymphNodes"]').forEach(cb => cb.checked = false);
    }
} 