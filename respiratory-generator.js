// Simple case sheet generator
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const editBtn = document.getElementById('editBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const mainForm = document.querySelector('main');
    const outputSection = document.getElementById('outputSection');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // Hide everything except the header
            Array.from(mainForm.children).forEach(child => {
                if (child.id !== 'outputSection') {
                    child.style.display = 'none';
                }
            });

            // Specifically hide these sections
            const otherSystemsSection = document.querySelector("#otherSystemsSection");
            const provisionalDiagnosisSection = document.querySelector("#provisionalDiagnosisSection");
            const generateButtonContainer = document.getElementById("generateBtnContainer");

            if (otherSystemsSection) otherSystemsSection.style.display = 'none';
            if (provisionalDiagnosisSection) provisionalDiagnosisSection.style.display = 'none';
            if (generateButtonContainer) generateButtonContainer.style.display = 'none';
            
            // Generate the case sheet content
            const caseSheetContent = generateCaseSheet();
            
            // Show output section
            outputSection.style.display = 'block';
            document.getElementById('caseSheetContent').innerHTML = caseSheetContent;
                window.scrollTo(0, 0);
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            // Show everything back
            Array.from(mainForm.children).forEach(child => {
                if (child.id !== 'outputSection') {
                    child.style.display = '';
                }
            });

            // Specifically show these sections
            const otherSystemsSection = document.querySelector("#otherSystemsSection");
            const provisionalDiagnosisSection = document.querySelector("#provisionalDiagnosisSection");
            const generateButtonContainer = document.getElementById("generateBtnContainer");

            if (otherSystemsSection) otherSystemsSection.style.display = 'block';
            if (provisionalDiagnosisSection) provisionalDiagnosisSection.style.display = 'block';
            if (generateButtonContainer) generateButtonContainer.style.display = 'block';
            
            // Hide output section
            outputSection.style.display = 'none';
            window.scrollTo(0, 0);
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const content = document.getElementById('caseSheetContent');
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
                
                // Get the text content and clean it up
                const cleanText = content.innerText
                    .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newlines
                    .trim();

                // Split into sections and process
                const sections = cleanText.split('\n');
                let y = 30;
                let currentPage = 1;

                sections.forEach(section => {
                    // Skip empty sections
                    if (!section.trim()) return;
                
                    // Check if we need a new page
                    if (y > 270) {
                        doc.addPage();
                        currentPage++;
                        y = 20;
                    }

                    // Split long lines to fit page width
                    const lines = doc.splitTextToSize(section.trim(), 180);

                    // Add each line
                    lines.forEach(line => {
                        if (y > 270) {
                            doc.addPage();
                            currentPage++;
                            y = 20;
                        }
                        if (line.trim()) {
                    doc.text(line, 15, y);
                    y += 7;
                        }
                    });

                    // Add small space after each section
                    y += 3;
                });
                
                // Save the PDF - ensure we only save once
                doc.save(`${patientName}_respiratory_case_sheet_${date}.pdf`);
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
            }
        });
    }

    // Add print button next to download button (only if it doesn't exist already)
    if (downloadBtn && downloadBtn.parentElement && !document.getElementById('printBtn')) {
        const printBtn = document.createElement('button');
        printBtn.id = 'printBtn';
        printBtn.className = 'btn-primary';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Sheet';
        printBtn.style.marginLeft = '10px';
        downloadBtn.parentElement.appendChild(printBtn);

        // Add print functionality
        printBtn.addEventListener('click', () => {
            const content = document.getElementById('caseSheetContent');
            const originalDisplay = mainForm.style.display;
            const originalContentDisplay = content.style.display;

            // Hide everything except the content to be printed
            Array.from(mainForm.children).forEach(child => {
                if (child !== outputSection) {
                    child.style.display = 'none';
                }
            });

            // Ensure content is visible and properly formatted for printing
            content.style.display = 'block';
            content.style.margin = '20px';
            content.style.padding = '20px';

            // Print the page
            window.print();

            // Restore original display settings
            Array.from(mainForm.children).forEach(child => {
                if (child !== outputSection) {
                    child.style.display = originalDisplay;
                }
            });
            content.style.display = originalContentDisplay;
        });
    }

// Function to collect and format negative history
function collectNegativeHistory() {
    const negativeHistorySection = document.querySelector('.negative-history');
    const presentFindings = new Map();
    const absentFindings = new Map();

    // Process each history category
    negativeHistorySection.querySelectorAll('.history-category').forEach(category => {
        const categoryName = category.querySelector('h4').textContent;
        
        // Process each checkbox in the category
        category.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const label = checkbox.parentElement.textContent.trim().toLowerCase();
            const key = label.replace(/^h\/o\s+/, ''); // Remove "H/O " prefix for comparison
            
            if (checkbox.checked) {
                presentFindings.set(key, `- ${checkbox.parentElement.textContent.trim()} seen`);
            } else {
                absentFindings.set(key, `- no ${checkbox.parentElement.textContent.trim().toLowerCase()} seen`);
            }
        });
    });

    return { 
        presentFindings: Array.from(presentFindings.values()), 
        absentFindings: Array.from(absentFindings.values()) 
    };
}

// Function to format past history
function formatPastHistory() {
    const pastHistoryItems = document.querySelectorAll('.past-history-item');
    let pastHistoryText = '\nPAST HISTORY:\n';
    
    // Track which histories have been added using normalized keys
    const addedHistories = new Set();
    const addedText = [];
    
    // Helper function to normalize history text for comparison
    function normalizeHistoryText(text) {
        return text.toLowerCase()
            .replace(/h\/o\s+/g, '')
            .replace(/history of\s+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    
    // First, add all the histories that are present
    pastHistoryItems.forEach(item => {
        const title = item.querySelector('.history-title').textContent;
        const details = item.querySelector('.history-details');
        let historyText = '';
        
        switch(true) {
            case /similar illness/i.test(title):
                const duration = details.querySelector('.history-duration')?.value;
                const episodeDetails = details.querySelector('.episode-duration')?.value;
                historyText = `- History of similar illness ${duration ? 'present ' + duration + ' back' : ''}${episodeDetails ? ', lasting for ' + episodeDetails : ''}\n`;
                addedHistories.add('similar illness');
                break;
                
            case /DM, HT/i.test(title):
                const conditions = Array.from(details.querySelectorAll('.condition-check:checked'))
                    .map(cb => cb.dataset.condition);
                const dmhtDuration = details.querySelector('.history-duration')?.value;
                if (conditions.length > 0) {
                    conditions.forEach(condition => addedHistories.add(condition.toLowerCase()));
                    historyText = `- History of ${conditions.join(', ')} ${dmhtDuration ? 'for ' + dmhtDuration : ''}\n`;
                }
                break;
                
            case /Bronchial Asthma/i.test(title):
                const asthmaDuration = details.querySelector('.history-duration')?.value;
                const status = details.querySelector('.treatment-status')?.value;
                const meds = details.querySelector('.medications')?.value;
                historyText = `- History of Bronchial Asthma ${asthmaDuration ? 'for ' + asthmaDuration : ''}, ${status || 'status unknown'}${meds ? ' on ' + meds : ''}\n`;
                addedHistories.add('bronchial asthma');
                break;
                
            case /Seizures/i.test(title):
                const seizureDuration = details.querySelector('.history-duration')?.value;
                const lastEpisode = details.querySelector('.last-episode')?.value;
                const seizureMeds = details.querySelector('.medications')?.value;
                historyText = `- History of Seizures ${seizureDuration ? 'for ' + seizureDuration : ''}, last episode ${lastEpisode || 'not specified'}${seizureMeds ? ' on ' + seizureMeds : ''}\n`;
                addedHistories.add('seizures');
                break;
                
            case /Surgery/i.test(title):
                const surgeryType = details.querySelector('.surgery-type')?.value;
                const surgeryDate = details.querySelector('.surgery-date')?.value;
                const surgeryDetails = details.querySelector('.surgery-details')?.value;
                historyText = `- History of ${surgeryType || 'Surgery'} ${surgeryDate ? surgeryDate + ' back' : ''}${surgeryDetails ? ' (' + surgeryDetails + ')' : ''}\n`;
                addedHistories.add('surgery');
                break;
                
            case /Blood Transfusion/i.test(title):
                const transfusionDate = details.querySelector('.transfusion-date')?.value;
                const reason = details.querySelector('.transfusion-reason')?.value;
                const transfusionDetails = details.querySelector('.transfusion-details')?.value;
                historyText = `- History of Blood Transfusion ${transfusionDate ? transfusionDate + ' back' : ''}${reason ? ' due to ' + reason : ''}${transfusionDetails ? ' (' + transfusionDetails + ')' : ''}\n`;
                addedHistories.add('blood transfusion');
                break;
                
            case /TB/i.test(title):
                const contact = details.querySelector('.contact-history')?.value;
                const ageAffected = details.querySelector('.age-affected')?.value;
                const treatmentStatus = details.querySelector('.treatment-status')?.value;
                historyText = `- History of TB ${ageAffected ? 'at age ' + ageAffected : ''}${contact !== 'no' ? ', contact with ' + contact : ''}${treatmentStatus ? ', treatment ' + treatmentStatus : ''}\n`;
                addedHistories.add('tb');
                break;
        }
        
        if (historyText) {
            addedText.push(historyText);
        }
    });
    
    // Add all positive histories first
    pastHistoryText += addedText.join('');
    
    // Then add negative histories for those not present
    const allHistories = [
        { key: 'similar illness', text: 'similar illness' },
        { key: 'dm', text: 'Diabetes Mellitus' },
        { key: 'ht', text: 'Hypertension' },
        { key: 'bronchial asthma', text: 'Bronchial Asthma' },
        { key: 'seizures', text: 'Seizures' },
        { key: 'surgery', text: 'Surgery' },
        { key: 'blood transfusion', text: 'Blood Transfusion' },
        { key: 'tb', text: 'TB' }
    ];
    
    allHistories.forEach(history => {
        if (!addedHistories.has(history.key)) {
            pastHistoryText += `- No history of ${history.text}\n`;
        }
    });
    
    return pastHistoryText;
}

// Function to format personal history
function formatPersonalHistory() {
    let personalHistoryText = '\nPERSONAL HISTORY:\n';
    
    // Diet
    const diet = document.querySelector('input[name="diet"]:checked')?.value || 'Mixed';
    personalHistoryText += `- Diet: ${diet} diet\n`;
    
    // Sleep
    const sleep = document.querySelector('input[name="sleep"]:checked')?.value || 'Normal';
    personalHistoryText += `- Sleep: ${sleep}\n`;
    
    // Bowel & Bladder
    const bowel = document.querySelector('input[name="bowel"]:checked')?.value || 'Regular';
    personalHistoryText += `- Bowel & Bladder: ${bowel}\n`;
    
    // Drug & Allergy History
    const drugAllergy = document.getElementById('drugAllergyHistory')?.value.trim();
    if (drugAllergy) {
        personalHistoryText += `- Drug & Allergy History: ${drugAllergy}\n`;
    }
    
    // Smoking History
    const smokingStatus = document.querySelector('input[name="smoking"]:checked')?.value || 'Never';
    if (smokingStatus === 'Never') {
        personalHistoryText += '- No history of smoking\n';
    } else {
        const duration = document.getElementById('smokingDuration')?.value;
        const cigarettesPerDay = document.getElementById('cigarettesPerDay')?.value;
        const smokingIndex = duration && cigarettesPerDay ? (duration * cigarettesPerDay) : 0;
        const packYears = duration && cigarettesPerDay ? ((cigarettesPerDay / 20) * duration).toFixed(1) : 0;
        
        personalHistoryText += `- Smoking: ${smokingStatus} smoker`;
        if (duration && cigarettesPerDay) {
            personalHistoryText += ` (${cigarettesPerDay} cigarettes/day for ${duration} years`;
            personalHistoryText += `, Smoking Index: ${smokingIndex}`;
            personalHistoryText += `, Pack Years: ${packYears})\n`;
            
            // Add risk assessment
            if (smokingIndex > 300) {
                personalHistoryText += '  * High risk for bronchogenic carcinoma (Smoking Index > 300)\n';
            }
            if (packYears > 40) {
                personalHistoryText += '  * High risk for bronchogenic carcinoma (Pack Years > 40)\n';
            }
        } else {
            personalHistoryText += '\n';
        }
    }
    
    // Other Habits
    const habits = Array.from(document.querySelectorAll('input[name="habits"]:checked'))
        .map(cb => cb.value)
        .filter(value => value !== 'None');
    
    if (habits.length > 0) {
        personalHistoryText += `- Other Habits: ${habits.join(', ')}\n`;
    } else {
        personalHistoryText += '- No history of other addictions\n';
    }
    
    // Exposure History
    const exposure = document.querySelector('input[name="exposure"]:checked')?.value || 'None';
    if (exposure === 'None') {
        personalHistoryText += '- No significant exposure history\n';
    } else if (exposure === 'Occupational') {
        const exposureTypes = Array.from(document.querySelectorAll('input[name="exposure_type"]:checked'))
            .map(cb => cb.value);
        personalHistoryText += `- Occupational Exposure: ${exposureTypes.join(', ')}\n`;
    } else {
        personalHistoryText += `- Exposure History: ${exposure}\n`;
    }
    
    return personalHistoryText;
    }

function generateCaseSheet() {
        // Get demographics
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const sex = document.getElementById('sex').value;
    const residence = document.getElementById('residence').value;
    const occupation = document.getElementById('occupation').value;
        const maritalStatus = document.getElementById('marital_status').value;
    
        // Get chief complaints
        const complaintsWithDuration = [];
    document.querySelectorAll('.selected-complaint').forEach(complaint => {
        const complaintName = complaint.querySelector('.complaint-name').textContent;
        const durationNumber = complaint.querySelector('.complaint-duration-number').value;
        const durationUnit = complaint.querySelector('.complaint-duration-unit').value;
        const duration = `${durationNumber} ${durationUnit}`;
            // Convert duration to days for sorting
            const durationInDays = parseDurationToDays(duration);
            complaintsWithDuration.push({
                text: `${complaintName} for past ${duration}`,
                name: complaintName,
                duration: duration,
                durationInDays: durationInDays
            });
        });

        // Sort complaints by duration (longest first)
        complaintsWithDuration.sort((a, b) => b.durationInDays - a.durationInDays);

    // Generate formatted case sheet with typewriter styling
    let caseSheet = `<div style="font-family: 'Courier New', 'American Typewriter', monospace; color: #222; line-height: 1.4; font-size: 16px; white-space: pre-wrap; background-color: #fff; padding: 20px;">`;
        
    // Add demographics with proper spacing
    caseSheet += `${name}, a ${age} years old ${maritalStatus} ${sex} from ${residence} who is a ${occupation} by occupation, came to OPD with chief complaints of:
`;
        
    // Add chief complaints in order of duration with proper indentation
        complaintsWithDuration.forEach(complaint => {
        caseSheet += `- ${complaint.text}
`;
        });

    caseSheet += `
HISTORY OF PRESENTING ILLNESS:
`;

        // Add the introductory line using the longest duration
        if (complaintsWithDuration.length > 0) {
            const firstComplaint = complaintsWithDuration[0];
        caseSheet += `The patient was apparently normal before ${firstComplaint.duration} after which ${sex.toLowerCase() === 'male' ? 'he' : 'she'} developed:
`;
        }

    // Get and sort histories
        const historiesWithDuration = [];
    document.querySelectorAll('.tab-content').forEach(tab => {
            // Get complaint name from the tab
            const complaintName = tab.dataset.complaint || '';
            const tabId = tab.id;
            
            // Get all the details for the complaint
            const duration = tab.querySelector(`input[name="${tabId}_duration"]`)?.value || '';
            const durationInDays = parseDurationToDays(duration);
            const onset = tab.querySelector(`input[name="${tabId}_onset"]:checked`)?.value || '';
            const progression = tab.querySelector(`input[name="${tabId}_progression"]:checked`)?.value || '';
            const type = tab.querySelector(`select[name="${tabId}_type"]`)?.value || '';
            const nature = tab.querySelector(`select[name="${tabId}_nature"]`)?.value || '';
            const character = tab.querySelector(`select[name="${tabId}_character"]`)?.value || '';
            
            // Get MMRC grades for breathlessness
            const initialMMRC = complaintName === 'Breathlessness' ? 
                tab.querySelector(`select[name="${tabId}_initial_mmrc_grade"]`)?.value || '' : '';
            const currentMMRC = complaintName === 'Breathlessness' ? 
                tab.querySelector(`select[name="${tabId}_current_mmrc_grade"]`)?.value || '' : '';
            
            // Get orthopnea and PND status for breathlessness
            const noOrthopnea = complaintName === 'Breathlessness' ? 
                tab.querySelector(`input[name="${tabId}_no_orthopnea"]`)?.checked || false : false;
            const noPND = complaintName === 'Breathlessness' ? 
                tab.querySelector(`input[name="${tabId}_no_pnd"]`)?.checked || false : false;
            
            // Get factors and symptoms from text inputs
            const aggravatingFactors = tab.querySelector(`input[name="${tabId}_aggravating_factors"]`)?.value.trim() || '';
            const relievingFactors = tab.querySelector(`input[name="${tabId}_relieving_factors"]`)?.value.trim() || '';
            const associatedSymptoms = tab.querySelector(`input[name="${tabId}_associated_symptoms"]`)?.value.trim() || '';
            
            // Get chest pain specific fields
            const location = tab.querySelector(`input[name="${tabId}_location"]`)?.value.trim() || '';
            const radiation = tab.querySelector(`input[name="${tabId}_radiation"]`)?.value.trim() || '';
            
            // Get variations
            const posturalVariation = tab.querySelector(`input[name="${tabId}_postural_variation"]`)?.checked || false;
            const diurnalVariation = tab.querySelector(`input[name="${tabId}_diurnal_variation"]`)?.checked || false;
            
            // Get additional notes
            const additionalNotes = tab.querySelector(`textarea[name="${tabId}_additional_notes"]`)?.value.trim() || '';

            // Build the formatted string
            let historyText = `- ${complaintName}: for the past ${duration}`;
            
            // Add onset and progression if available
            if (onset) historyText += `, ${onset} in onset`;
            if (progression) historyText += `, ${progression} in nature`;
            
            // Add character if available
            if (character) historyText += `, ${character} in character`;
            
            // Add type if available (only for cough)
            if (complaintName.toLowerCase() === 'cough' && type) {
                historyText += `, ${type} type of cough`;
                // Add nature only for cough
                if (nature) historyText += `, ${nature} cough`;
            }
            
            // Add MMRC grades for breathlessness
            if (complaintName === 'Breathlessness' && initialMMRC && currentMMRC) {
                const initialGrade = initialMMRC.match(/Grade (\d)/)[1];
                const currentGrade = currentMMRC.match(/Grade (\d)/)[1];
                historyText += `, from grade ${initialGrade} to grade ${currentGrade} according to MMRC (Modified Medical Research Council) grading`;
            }
            
            // Add orthopnea and PND status for breathlessness
            if (complaintName === 'Breathlessness') {
                historyText += noOrthopnea ? ', no orthopnea' : ', orthopnea present';
                historyText += noPND ? ', no PND' : ', PND present';
            }
            
            // Add location and radiation for chest pain
            if (complaintName === 'Chest Pain') {
                historyText += location ? `, located in ${location}` : ', location not specified';
                historyText += radiation ? `, radiating to ${radiation}` : ', with no radiation';
            }
            
            // Add factors and symptoms with explicit "no" statements when empty
            historyText += aggravatingFactors ? `, aggravated by ${aggravatingFactors}` : ', no aggravating factors';
            historyText += relievingFactors ? `, relieved by ${relievingFactors}` : ', no relieving factors';
            historyText += associatedSymptoms ? `, associated with ${associatedSymptoms}` : ', no associated symptoms';
            
            // Add variations only if they exist (skip "no variation" text)
            if (posturalVariation) historyText += ', with postural variation';
            if (diurnalVariation) historyText += ', with diurnal variation';
            
            // Add additional notes if any
            if (additionalNotes) {
                historyText += `, ${additionalNotes}`;
            }
            
            historyText += '.<br><br>';
            
            // Store the history with its duration for sorting
            historiesWithDuration.push({
                text: historyText,
                durationInDays: durationInDays
            });
        });

    // Sort and add histories with proper spacing
        historiesWithDuration.sort((a, b) => b.durationInDays - a.durationInDays);
        historiesWithDuration.forEach(history => {
            caseSheet += history.text;
        });

    // Add Negative History section with proper formatting
    const { presentFindings, absentFindings } = collectNegativeHistory();
    if (presentFindings.length > 0 || absentFindings.length > 0) {
        caseSheet += `
NEGATIVE HISTORY:
`;
        presentFindings.forEach(finding => {
            caseSheet += `${finding}\n`;
        });
        absentFindings.forEach(finding => {
            caseSheet += `${finding}\n`;
        });
    }

    // Add Past History
    caseSheet += formatPastHistory();

    // Add Personal History
    caseSheet += formatPersonalHistory();

    // Add Menstrual History for female patients
    if (sex.toLowerCase() === 'female') {
        const menstrualHistory = document.getElementById('menstrualHistory')?.value?.trim();
        if (menstrualHistory) {
            caseSheet += `\nMENSTRUAL HISTORY:\n${menstrualHistory}\n`;
        }
    }

    // Add Treatment History
    const treatmentHistory = document.getElementById('treatmentHistory')?.value?.trim();
    if (treatmentHistory) {
        caseSheet += `\nTREATMENT HISTORY:\n- ${treatmentHistory}\n`;
    }

    // Add Contact History
    const contactHistory = document.getElementById('contactHistory')?.value?.trim();
    if (contactHistory) {
        caseSheet += `\nCONTACT HISTORY:\n- ${contactHistory}\n`;
    }

    // Add Family History
    const familyHistory = document.getElementById('familyHistory')?.value?.trim();
    if (familyHistory) {
        caseSheet += `\nFAMILY HISTORY:\n- ${familyHistory}\n`;
    }

    // Add Summary (with only history)
    caseSheet += `
SUMMARY (with only history):
${name}, ${age} years old ${sex}`;

    // Add occupation if it's not "student" or "housewife"
    if (!['student', 'housewife'].includes(occupation.toLowerCase())) {
        caseSheet += ` who is a ${occupation}`;
    }

    // Add chief complaints without duration
    const complaintNames = complaintsWithDuration.map(c => c.name);
    if (complaintNames.length > 1) {
        const lastComplaint = complaintNames.pop();
        caseSheet += ` came with chief complaints of ${complaintNames.join(', ')} and ${lastComplaint}`;
    } else if (complaintNames.length === 1) {
        caseSheet += ` came with chief complaint of ${complaintNames[0]}`;
    }

    // Add positive findings from personal history
    const positiveFindings = [];

    // Check smoking history
    const smokingStatus = document.querySelector('input[name="smoking"]:checked')?.value;
    if (smokingStatus && smokingStatus !== 'Never') {
        positiveFindings.push(`history of smoking present`);
    }

    // Check other habits
    const habits = Array.from(document.querySelectorAll('.habit-checkbox:checked'))
        .map(cb => cb.value)
        .filter(habit => habit !== 'None');
    if (habits.length > 0) {
        const habitText = habits.map(habit => {
            if (habit === 'BetelNut') return 'tobacco/betel nut chewing';
            return habit.toLowerCase();
        }).join(', ');
        positiveFindings.push(`history of ${habitText} present`);
    }

    // Add positive findings from past history
    const pastHistoryList = document.querySelector('.past-history-list');
    if (pastHistoryList) {
        const pastHistoryItems = Array.from(pastHistoryList.children)
            .map(item => {
                const text = item.textContent.trim();
                if (!text || text.includes('No history')) return null;
                
                // Extract just the condition name
                if (text.includes('H/O DM, HT')) return 'diabetes mellitus, hypertension';
                if (text.startsWith('H/O ')) {
                    // Get only the condition name by taking text before any form fields
                    const basicText = text.split('×')[0].trim() // Split on the close button
                        .split('when:')[0].trim() // Split on form field labels
                        .split('details:')[0].trim()
                        .split('duration:')[0].trim()
                        .replace('H/O ', '')
                        .toLowerCase();
                    return basicText;
                }
                return text.toLowerCase();
            })
            .filter(Boolean) // Remove null values
            .filter(text => text.length > 0); // Remove empty strings
        
        if (pastHistoryItems.length > 0) {
            positiveFindings.push(`has past history of ${pastHistoryItems.join(', ')}`);
        }
    }

    // Add positive findings from negative history section
    const { presentFindings: negativeHistoryFindings } = collectNegativeHistory();
    if (negativeHistoryFindings.length > 0) {
        const findings = negativeHistoryFindings
            .map(finding => finding
                .replace(/^- /, '')  // Remove leading dash
                .replace(' seen', '')    // Remove 'seen'
                .replace(/^H\/O /, '')   // Remove 'H/O'
                .replace(/\s+×\s+/, '')  // Remove close button
                .replace(/when:\s*/, '') // Remove form labels
                .replace(/details:\s*/, '')
                .replace(/duration:\s*/, '')
                .toLowerCase()
                .trim())
            .filter(text => text.length > 0) // Remove empty strings
            .join(', ');
        positiveFindings.push(`positive for ${findings}`);
    }

    // Add all positive findings to summary
    if (positiveFindings.length > 0) {
        caseSheet += `, ${positiveFindings.join(', ')}`;
    }

    caseSheet += `.\nThe probable system involved is respiratory system.\n`;

    // Add consent and examination setting
    caseSheet += `\nAfter getting proper consent, the patient was examined in a well lit room.\n`;

    // Add General Examination section
    caseSheet += `\nGENERAL EXAMINATION:\n`;

    // Get consciousness
    const consciousness = document.querySelector('input[name="consciousness"]:checked')?.parentElement?.textContent?.trim();
    if (consciousness) {
        caseSheet += `- ${consciousness}\n`;
    }

    // Get general condition
    const condition = document.querySelector('input[name="comfortable"]:checked')?.parentElement?.textContent?.trim();
    if (condition) {
        caseSheet += `- ${condition}\n`;
    }

    // Get temperature and pattern
    const temp = document.querySelector('input[type="number"][placeholder="Temperature in °F"]')?.value;
    const tempPattern = document.querySelector('select option:checked')?.value;
    if (temp) {
        const febrileStatus = parseFloat(temp) > 98.6 ? `Febrile (${temp}°F)` : 'Afebrile';
        caseSheet += `- ${febrileStatus}${tempPattern ? ` with ${tempPattern} pattern` : ''}\n`;
    }

    // Get built and nourishment
    const built = document.querySelector('input[name="built"]:checked')?.parentElement?.textContent?.trim();
    if (built) {
        caseSheet += `- ${built}\n`;
    }

    // Get physical findings with grades
    const pallor = document.querySelector('select.exam-select:nth-of-type(1) option:checked')?.textContent?.trim();
    const jaundice = document.querySelector('select.exam-select:nth-of-type(2) option:checked')?.textContent?.trim();
    const clubbing = document.querySelector('select.exam-select:nth-of-type(3) option:checked')?.textContent?.trim();
    const cyanosis = document.querySelector('select.exam-select:nth-of-type(4) option:checked')?.textContent?.trim();
    const edema = document.querySelector('select.exam-select:nth-of-type(5) option:checked')?.textContent?.trim();
    const edemaType = document.querySelector('select.exam-select:nth-of-type(6) option:checked')?.textContent?.trim();

    let findings = [];
    if (pallor) findings.push(pallor);
    if (jaundice) findings.push(jaundice);
    if (clubbing) findings.push(clubbing);
    if (cyanosis) findings.push(cyanosis);
    if (edema) findings.push(`${edema}${edemaType ? ` (${edemaType})` : ''}`);
    if (findings.length > 0) {
        caseSheet += `- Physical findings: ${findings.join(', ')}\n`;
    }

    // Get lymphadenopathy details
    const lymphadenopathy = document.querySelector('input[name="lymphadenopathy"]:checked')?.value;
    if (lymphadenopathy === 'yes') {
        const locations = Array.from(document.querySelectorAll('input[name="lymphNodes"]:checked'))
            .map(cb => cb.parentElement?.textContent?.trim())
            .filter(Boolean)
            .join(', ');
        const type = document.querySelector('#lymphNodeType option:checked')?.textContent?.trim();
        const size = document.querySelector('#lymphNodeSize')?.value;
        const characteristics = Array.from(document.querySelector('#lymphNodeCharacteristics')?.selectedOptions || [])
            .map(opt => opt.textContent?.trim())
            .filter(Boolean)
            .join(', ');
        
        let details = [];
        if (locations) details.push(`located in ${locations}`);
        if (type) details.push(type);
        if (size) details.push(`${size} cm in size`);
        if (characteristics) details.push(`${characteristics} in nature`);
        
        caseSheet += `- Lymphadenopathy present: ${details.join(', ')}\n`;
    } else {
        caseSheet += `- No lymphadenopathy\n`;
    }

    // Get halitosis
    const halitosis = document.querySelector('select.exam-select:last-of-type option:checked')?.textContent?.trim();
    if (halitosis) {
        if (halitosis === 'Not Present') {
            caseSheet += `- No halitosis\n`;
        } else {
            caseSheet += `- Halitosis present: ${halitosis.toLowerCase()} in severity\n`;
        }
    }

    // Add Vitals section
    caseSheet += `\nVITALS:\n`;

    // Get pulse details
    const pulseRate = document.querySelector('#pulseRate')?.value;
    const pulseRateType = document.querySelector('input[name="pulseRate"]:checked')?.value?.toLowerCase();
    const pulseRhythm = document.querySelector('input[name="pulseRhythm"]:checked')?.value?.toLowerCase();
    const pulseVolume = document.querySelector('input[name="pulseVolume"]:checked')?.value?.toLowerCase();
    const vesselWall = document.querySelector('input[name="vesselWall"]:checked')?.value?.toLowerCase();
    const radioRadial = document.querySelector('input[name="radioRadial"]:checked')?.value?.toLowerCase();
    const radioFemoral = document.querySelector('input[name="radioFemoral"]:checked')?.value?.toLowerCase();
    const peripheralVessels = document.querySelector('input[name="peripheralVessels"]:checked')?.parentElement?.textContent?.trim();

    if (pulseRate) {
        let pulseDetails = [`${pulseRate} beats/min`];
        if (pulseRateType) pulseDetails.push(`${pulseRateType} rate`);
        if (pulseRhythm) pulseDetails.push(`${pulseRhythm} rhythm`);
        if (pulseVolume) pulseDetails.push(`${pulseVolume} volume`);
        if (vesselWall) pulseDetails.push(`${vesselWall} vessel wall`);
        if (radioRadial) pulseDetails.push(radioRadial === 'absent' ? 'no radio-radial delay' : 'radio-radial delay present');
        if (radioFemoral) pulseDetails.push(radioFemoral === 'absent' ? 'no radio-femoral delay' : 'radio-femoral delay present');
        if (peripheralVessels) pulseDetails.push(peripheralVessels);
        caseSheet += `- Pulse: ${pulseDetails.join(', ')}\n`;
    }

    // Get blood pressure details
    const systolic = document.querySelector('input[placeholder="Systolic"]')?.value;
    const diastolic = document.querySelector('input[placeholder="Diastolic"]')?.value;
    const bpPosition = document.querySelector('input[name="bpPosition"]:checked')?.value?.toLowerCase();
    const bpArm = document.querySelector('input[name="bpArm"]:checked')?.value?.toLowerCase();

    if (systolic && diastolic) {
        let bpDetails = [`${systolic}/${diastolic} mmHg`];
        if (bpPosition) bpDetails.push(`measured in ${bpPosition} position`);
        if (bpArm) bpDetails.push(`in ${bpArm} arm`);
        caseSheet += `- Blood Pressure: ${bpDetails.join(', ')}\n`;
    }

    // Get temperature details
    const temperature = document.querySelector('input[placeholder="Temperature"]')?.value;
    const tempMethod = document.querySelector('input[name="tempMethod"]:checked')?.value?.toLowerCase();
    if (temperature) {
        caseSheet += `- Temperature: ${temperature}°F${tempMethod ? ` (${tempMethod} measurement)` : ''}\n`;
    }

    // Get SpO2 details
    const spo2 = document.querySelector('input[placeholder="Saturation"]')?.value;
    const o2Support = document.querySelector('input[name="o2Support"]:checked')?.value;
    if (spo2) {
        caseSheet += `- SpO2: ${spo2}% ${o2Support === 'Yes' ? 'on room air' : 'on oxygen support'}\n`;
    }

    // Get respiratory rate details
    const respRate = document.querySelector('#respiratoryRate')?.value;
    const respPattern = document.querySelector('input[name="respiratoryPattern"]:checked')?.value?.toLowerCase();
    const respDepth = document.querySelector('input[name="respiratoryDepth"]:checked')?.value?.toLowerCase();
    if (respRate) {
        let respDetails = [`${respRate} breaths/min`];
        if (respPattern) respDetails.push(`${respPattern} pattern`);
        if (respDepth) respDetails.push(`${respDepth} depth`);
        caseSheet += `- Respiratory Rate: ${respDetails.join(', ')}\n`;
    }

    // Get JVP details
    const jvp = document.querySelector('#jvpValue')?.value;
    const jvpCharacter = document.querySelector('input[name="jvpCharacter"]:checked')?.value?.toLowerCase();
    if (jvp) {
        let jvpDetails = [`${jvp} cm H2O`];
        if (jvpCharacter) jvpDetails.push(jvpCharacter === 'normal' ? 'normal character' : 'elevated');
        caseSheet += `- JVP: ${jvpDetails.join(', ')}\n`;
    }

    caseSheet += '\n';

    // Add Systemic Examination
    caseSheet += `SYSTEMIC EXAMINATION OF RESPIRATORY SYSTEM:\n`;
    caseSheet += `\nINSPECTION:\n`;

    // Get inspection findings
    const inspectionFindings = document.getElementById('inspectionFindings')?.value;
    if (inspectionFindings) {
        // Split the findings into sections
        const sections = inspectionFindings.split('\n\n');
        sections.forEach(section => {
            const lines = section.split('\n');
            const title = lines[0];
            const findings = lines.slice(1);
            
            // Add the section title with a colon
            if (title) {
                caseSheet += `${title}:\n`;
            }
            
            // Add each finding with a bullet point
            findings.forEach(finding => {
                if (finding.trim()) {
                    caseSheet += `- ${finding.trim()}\n`;
                }
            });
            caseSheet += '\n';
        });
    }

    // Add inspection findings for trachea and chest movement
    const tracheaPosition = document.querySelector('input[name="trachea_position"]:checked')?.value;
    if (tracheaPosition) {
        caseSheet += `- Trachea appears to be ${tracheaPosition === 'midline' ? 'in midline' : `deviated to ${tracheaPosition} side`}\n`;
    }

    const chestMovement = document.querySelector('input[name="chest_movement"]:checked')?.value;
    if (chestMovement === 'normal') {
        caseSheet += `- Chest moves equally with respiration\n`;
    } else if (chestMovement === 'decreased_left') {
        caseSheet += `- Decreased chest movement on left side\n`;
    } else if (chestMovement === 'decreased_right') {
        caseSheet += `- Decreased chest movement on right side\n`;
    }

    // Add abnormal findings
    const noAbnormalFindings = document.querySelector('input[name="no_abnormal_findings"]')?.checked;
    const noScarsSinus = document.querySelector('input[name="no_scars_sinus"]')?.checked;
    const abnormalLocation = document.querySelector('input[name="abnormal_location"]')?.value;

    if (noAbnormalFindings) {
        caseSheet += `- No abnormal pulsations, dilated veins seen\n`;
    } else if (abnormalLocation) {
        caseSheet += `- Abnormal pulsations, dilated veins seen over ${abnormalLocation}\n`;
    }

    if (noScarsSinus) {
        caseSheet += `- No scars, sinus present\n`;
    } else if (abnormalLocation) {
        caseSheet += `- Scars/sinus present over ${abnormalLocation}\n`;
    }

    caseSheet += '\n';

    // Add PALPATION section
    caseSheet += `PALPATION:\n\n`;

    // Basic Findings
    caseSheet += `Basic Findings:\n`;
    const tracheaPalpation = document.querySelector('input[name="trachea_palpation"]:checked')?.value;
    caseSheet += `- Tracheal position is confirmed to be ${tracheaPalpation === 'midline' ? 'in midline' : `deviated to ${tracheaPalpation} side`}\n`;

    const apexBeatChecked = document.querySelector('input[name="apex_beat_position"]')?.checked;
    const apexBeatLocation = document.querySelector('input[name="apex_beat_location"]')?.value;
    if (apexBeatChecked) {
        caseSheet += `- Apex beat at left 5th intercostal space half inch medial to midclavicular line\n`;
    } else if (apexBeatLocation) {
        caseSheet += `- Apex beat felt at ${apexBeatLocation}\n`;
    } else {
        caseSheet += `- Apex beat not felt\n`;
    }
    caseSheet += '\n';

    // Chest Movement
    caseSheet += `Chest Movement:\n`;
    const chestExpansion = document.querySelector('input[name="chest_expansion"]')?.value;
    const rightExpansion = document.querySelector('input[name="right_expansion"]')?.value;
    const leftExpansion = document.querySelector('input[name="left_expansion"]')?.value;
    const respMovement = document.querySelector('input[name="resp_movement"]:checked')?.value;

    caseSheet += `- Total chest expansion: ${chestExpansion} cm\n`;
    caseSheet += `- Hemithorax expansion: Right ${rightExpansion} cm, Left ${leftExpansion} cm\n`;
    
    switch(respMovement) {
        case 'normal':
            caseSheet += `- Respiratory movements: Normal bilaterally\n`;
            break;
        case 'decreased_left':
            caseSheet += `- Respiratory movements: Decreased on left side, normal on right side\n`;
            break;
        case 'decreased_right':
            caseSheet += `- Respiratory movements: Decreased on right side, normal on left side\n`;
            break;
        case 'decreased_both':
            caseSheet += `- Respiratory movements: Decreased bilaterally\n`;
            break;
    }
    caseSheet += '\n';

    // Vocal Fremitus
    caseSheet += `Vocal Fremitus:\n`;
    caseSheet += `+------------------------+----------+---------+\n`;
    caseSheet += `|        Region         |  Right   |  Left   |\n`;
    caseSheet += `+------------------------+----------+---------+\n`;

    const fremitusRegions = [
        'Directly on clavicle',
        'Supra clavicular',
        'Infra clavicular',
        'Mammary',
        'Axillary',
        'Infra axillary',
        'Supra scapular',
        'Inter scapular',
        'Infra scapular'
    ];

    fremitusRegions.forEach((region, index) => {
        const rightSelect = document.querySelectorAll('.fremitus-select')[index * 2];
        const leftSelect = document.querySelectorAll('.fremitus-select')[index * 2 + 1];
        const rightValue = rightSelect?.value || 'normal';
        const leftValue = leftSelect?.value || 'normal';
        
        // Pad the region name and values to align properly
        const paddedRegion = region.padEnd(24);
        const paddedRight = rightValue.padEnd(8);
        const paddedLeft = leftValue.padEnd(7);
        
        caseSheet += `| ${paddedRegion} | ${paddedRight} | ${paddedLeft} |\n`;
    });
    
    caseSheet += `+------------------------+----------+---------+\n\n`;

    // Add PERCUSSION section
    caseSheet += `PERCUSSION:\n\n`;

    // Lung Percussion Table
    caseSheet += `Lung Percussion:\n`;
    caseSheet += `+------------------------+----------+---------+\n`;
    caseSheet += `|        Region         |  Right   |  Left   |\n`;
    caseSheet += `+------------------------+----------+---------+\n`;

    const percussionRegions = [
        'Directly on clavicle',
        'Supra clavicular',
        'Infra clavicular',
        'Mammary',
        'Axillary',
        'Infra axillary',
        'Supra scapular',
        'Inter scapular',
        'Infra scapular'
    ];

    percussionRegions.forEach((region, index) => {
        const rightSelect = document.querySelectorAll('.percussion-select')[index * 2];
        const leftSelect = document.querySelectorAll('.percussion-select')[index * 2 + 1];
        const rightValue = rightSelect?.value || 'resonant';
        const leftValue = leftSelect?.value || 'resonant';
        
        // Pad the region name and values to align properly
        const paddedRegion = region.padEnd(24);
        const paddedRight = rightValue.padEnd(8);
        const paddedLeft = leftValue.padEnd(7);
        
        caseSheet += `| ${paddedRegion} | ${paddedRight} | ${paddedLeft} |\n`;
    });
    
    caseSheet += `+------------------------+----------+---------+\n\n`;

    // Additional Percussion Findings
    const tidalPercussion = document.querySelector('input[name="tidal_percussion"]:checked')?.value;
    caseSheet += `- Tidal percussion: ${tidalPercussion === 'felt' ? 'felt' : 'not felt'}\n`;

    const traubesSpace = document.querySelector('input[name="traubes_space"]:checked')?.value;
    caseSheet += `- Traube's space: ${traubesSpace === 'not_obliterated' ? 'not obliterated' : 'obliterated'}\n`;

    const shiftingDullness = document.querySelector('input[name="shifting_dullness"]:checked')?.value;
    caseSheet += `- Shifting dullness: ${shiftingDullness === 'absent' ? 'absent' : 'present'}\n`;

    const straightLineDullness = document.querySelector('input[name="straight_line_dullness"]:checked')?.value;
    caseSheet += `- Straight line dullness: ${straightLineDullness === 'absent' ? 'absent' : 'present'}\n`;

    const cardiacDullness = document.querySelector('input[name="cardiac_dullness"]:checked')?.value;
    const cardiacDullnessNotes = document.querySelector('input[name="cardiac_dullness_notes"]')?.value;
    
    switch(cardiacDullness) {
        case 'normal':
            caseSheet += `- Right border of the heart can be percussed\n`;
            caseSheet += `- Left border of the heart can be percussed\n`;
            break;
        case 'left_border':
            caseSheet += `- Right border of the heart can be percussed\n`;
            caseSheet += `- Left border of the heart cannot be percussed\n`;
            break;
        case 'right_border':
            caseSheet += `- Right border of the heart cannot be percussed\n`;
            caseSheet += `- Left border of the heart can be percussed\n`;
            break;
        case 'both_borders':
            caseSheet += `- Right border of the heart cannot be percussed\n`;
            caseSheet += `- Left border of the heart cannot be percussed\n`;
            break;
    }
    caseSheet += '\n';

    // Get added sounds
    const addedSoundsSelects = document.querySelectorAll('.added-sounds-select');
    let addedSoundsFindings = {
        left: {},
        right: {}
    };

    addedSoundsSelects.forEach((select, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        const region = select.closest('tr').querySelector('td:first-child').textContent;
        const value = select.value;
        
        if (value !== 'none') {
            if (!addedSoundsFindings[side][value]) {
                addedSoundsFindings[side][value] = [];
            }
            addedSoundsFindings[side][value].push(region);
        }
    });

    // Format added sounds findings
    for (const side of ['left', 'right']) {
        const findings = addedSoundsFindings[side];
        if (Object.keys(findings).length > 0) {
            caseSheet += `\nOn ${side} side:\n`;
            for (const [sound, regions] of Object.entries(findings)) {
                let soundText = '';
                switch(sound) {
                    case 'crackles':
                        soundText = 'Crackles';
                        break;
                    case 'crepitations':
                        soundText = 'Crepitations';
                        break;
                    case 'ronchi':
                        soundText = 'Ronchi';
                        break;
                    case 'wheeze':
                        soundText = 'Wheeze';
                        break;
                    case 'pleural-rub':
                        soundText = 'Pleural Rub';
                        break;
                }
                caseSheet += `- ${soundText} present in ${regions.join(', ')} region${regions.length > 1 ? 's' : ''}\n`;
            }
        }
    }

    // Add Auscultation section
    caseSheet += `\nAUSCULTATION:\n`;

    // BREATH SOUNDS table
    caseSheet += `\nBREATH SOUNDS:\n`;
    caseSheet += `+------------------+----------+----------+\n`;
    caseSheet += `| Region           | Left     | Right    |\n`;
    caseSheet += `+------------------+----------+----------+\n`;
    
    // Get all rows for breath sounds
    const breathSoundRows = document.querySelectorAll('.breath-sounds-select');
    const regions = ['Directly on clavicle', 'Supra clavicular', 'Infra clavicular', 'Mammary', 'Axillary', 'Infra axillary', 'Supra scapular', 'Inter scapular', 'Infra scapular'];
    
    for (let i = 0; i < regions.length; i++) {
        const leftSound = breathSoundRows[i * 2].value;
        const rightSound = breathSoundRows[i * 2 + 1].value;
        caseSheet += `| ${regions[i].padEnd(16)} | ${leftSound.padEnd(8)} | ${rightSound.padEnd(8)} |\n`;
    }
    caseSheet += `+------------------+----------+----------+\n\n`;

    // ADDED SOUNDS table
    caseSheet += `ADDED SOUNDS:\n`;
    caseSheet += `+------------------+----------+----------+\n`;
    caseSheet += `| Region           | Left     | Right    |\n`;
    caseSheet += `+------------------+----------+----------+\n`;
    
    // Get all rows for added sounds
    const addedSoundRows = document.querySelectorAll('.added-sounds-select');
    for (let i = 0; i < regions.length; i++) {
        const leftSound = addedSoundRows[i * 2].value;
        const rightSound = addedSoundRows[i * 2 + 1].value;
        const leftDisplay = leftSound === 'none' ? '-' : leftSound;
        const rightDisplay = rightSound === 'none' ? '-' : rightSound;
        caseSheet += `| ${regions[i].padEnd(16)} | ${leftDisplay.padEnd(8)} | ${rightDisplay.padEnd(8)} |\n`;
    }
    caseSheet += `+------------------+----------+----------+\n\n`;

    // VOCAL RESONANCE table
    caseSheet += `VOCAL RESONANCE:\n`;
    caseSheet += `+------------------+----------+----------+\n`;
    caseSheet += `| Region           | Left     | Right    |\n`;
    caseSheet += `+------------------+----------+----------+\n`;
    
    // Get all rows for vocal resonance
    const vocalResonanceRows = document.querySelectorAll('.vocal-resonance-select');
    for (let i = 0; i < regions.length; i++) {
        const leftResonance = vocalResonanceRows[i * 2].value;
        const rightResonance = vocalResonanceRows[i * 2 + 1].value;
        caseSheet += `| ${regions[i].padEnd(16)} | ${leftResonance.padEnd(8)} | ${rightResonance.padEnd(8)} |\n`;
    }
    caseSheet += `+------------------+----------+----------+\n\n`;

    // Add Other Systems section
    caseSheet += `OTHER SYSTEMS:\n\n`;

    // Add CVS Examination
    const cvsExamination = document.querySelector('textarea[name="cvs_examination"]')?.value?.trim();
    if (cvsExamination) {
        caseSheet += `CVS Examination:\n- ${cvsExamination}\n\n`;
    }

    // Add CNS Examination
    const cnsExamination = document.querySelector('textarea[name="cns_examination"]')?.value?.trim();
    if (cnsExamination) {
        caseSheet += `CNS Examination:\n- ${cnsExamination}\n\n`;
    }

    // Add Abdomen Examination
    const abdomenExamination = document.querySelector('textarea[name="abdomen_examination"]')?.value?.trim();
    if (abdomenExamination) {
        caseSheet += `Abdomen Examination:\n- ${abdomenExamination}\n\n`;
    }

    // Add Probable Diagnosis
    const probableDiagnosis = document.getElementById('provisional_diagnosis')?.value?.trim();
    if (probableDiagnosis) {
        caseSheet += `PROBABLE DIAGNOSIS:\n${probableDiagnosis}\n\n`;
    }

        caseSheet += '</div>';
        return caseSheet;
    }

// Make generateCaseSheet available globally
window.generateCaseSheet = generateCaseSheet;

    function parseDurationToDays(durationStr) {
    try {
        const [number, unit] = durationStr.trim().split(' ');
        const value = parseFloat(number);
        
        if (isNaN(value)) return 0;
        
        switch(unit.toLowerCase()) {
            case 'days':
            case 'day':
                return value;
            case 'weeks':
            case 'week':
                return value * 7;
            case 'months':
            case 'month':
                return value * 30;
            case 'years':
            case 'year':
                return value * 365;
            default:
                return 0;
        }
    } catch (error) {
        console.error('Error parsing duration:', error);
        return 0;
    }
}

function formatGeneralExamination() {
    let examText = '\nGENERAL EXAMINATION:\n';
    
    // Lymphadenopathy
    const lymphStatus = document.querySelector('input[name="lymphadenopathy"]:checked')?.value;
    
    if (lymphStatus === 'no') {
        examText += '- No significant lymphadenopathy\n';
    } else if (lymphStatus === 'yes') {
        const selectedNodes = Array.from(document.getElementById('lymphNodes').selectedOptions)
            .map(opt => opt.value);
        const lymphType = document.getElementById('lymphNodeType').value;
        const size = document.getElementById('lymphNodeSize').value;
        const characteristics = Array.from(document.getElementById('lymphNodeCharacteristics').selectedOptions)
            .map(opt => opt.value);
        
        examText += '- Lymphadenopathy present';
        if (lymphType) {
            examText += `, ${lymphType}`;
        }
        if (selectedNodes.length > 0) {
            examText += ` in ${selectedNodes.join(', ')} region${selectedNodes.length > 1 ? 's' : ''}`;
        }
        if (size) {
            examText += `, approximately ${size} cm`;
        }
        if (characteristics.length > 0) {
            examText += `. Nodes are ${characteristics.join(', ')}`;
        }
        examText += '\n';
            }
        
    return examText;
    }
}); 