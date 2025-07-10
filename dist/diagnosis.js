function generateDiagnosis() {
    // Initialize disease scores with side tracking
    const diseases = {
        consolidation: { score: 0, side: '' },
        collapse: { score: 0, side: '' },
        fibrosis: { score: 0, side: '' },
        cavity: { score: 0, side: '' },
        bronchiectasis: { score: 0, side: '' },
        pleuralEffusion: { score: 0, side: '' },
        pneumothorax: { score: 0, side: '' },
        bronchitis: { score: 0, side: '' },
        emphysema: { score: 0, side: '' },
        bronchialAsthma: { score: 0, side: '' }
    };

    // Get patient name and format it properly
    const patientName = document.getElementById('name')?.value || '';
    const formattedName = patientName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    // Check percussion notes for each region
    document.querySelectorAll('select[name^="percussion_"]').forEach(select => {
        const region = select.name.replace('percussion_', '');
        const note = select.value;
        const side = region.includes('right') ? 'Right' : 'Left';

        // Score based on percussion notes
        switch(note) {
            case 'stony_dull':
                diseases.pleuralEffusion.score += 1;
                diseases.pleuralEffusion.side = side;
                break;
            case 'dull':
                diseases.consolidation.score += 1;
                diseases.consolidation.side = side;
                diseases.collapse.score += 1;
                diseases.collapse.side = side;
                break;
            case 'impaired':
                diseases.fibrosis.score += 1;
                diseases.fibrosis.side = side;
                diseases.cavity.score += 1;
                diseases.cavity.side = side;
                diseases.bronchiectasis.score += 1;
                diseases.bronchiectasis.side = side;
                break;
            case 'hyper_resonant':
                diseases.pneumothorax.score += 1;
                diseases.pneumothorax.side = side;
                diseases.emphysema.score += 1;
                diseases.emphysema.side = side;
                break;
        }
    });

    // Check breath sounds
    document.querySelectorAll('select[class="breath-sounds-select"]').forEach(select => {
        const row = select.closest('tr');
        const side = select.closest('td').cellIndex === 1 ? 'Right' : 'Left';
        const sound = select.value;

        switch(sound) {
            case 'tubular':
                diseases.consolidation.score += 1;
                diseases.consolidation.side = side;
                break;
            case 'vesicular':
                diseases.bronchiectasis.score += 1;
                diseases.bronchiectasis.side = side;
                diseases.bronchialAsthma.score += 1;
                break;
            case 'diminished':
            case 'absent':
                diseases.pleuralEffusion.score += 1;
                diseases.pleuralEffusion.side = side;
                diseases.collapse.score += 1;
                diseases.collapse.side = side;
                break;
            case 'cavernous':
                diseases.cavity.score += 1;
                diseases.cavity.side = side;
                break;
        }
    });

    // Check added sounds
    const addedSounds = {
        crepitations: document.querySelector('input[name="crepitations"]')?.checked || false,
        wheeze: document.querySelector('input[name="wheeze"]')?.checked || false,
        rhonchi: document.querySelector('input[name="rhonchi"]')?.checked || false,
        pleuralRub: document.querySelector('input[name="pleural_rub"]')?.checked || false
    };

    if (addedSounds.crepitations) {
        diseases.consolidation.score += 1;
        diseases.cavity.score += 1;
    }
    if (addedSounds.wheeze) {
        diseases.bronchialAsthma.score += 1;
    }
    if (addedSounds.rhonchi) {
        diseases.bronchitis.score += 1;
        diseases.bronchiectasis.score += 1;
    }
    if (addedSounds.pleuralRub) {
        diseases.pleuralEffusion.score += 1;
    }

    // Find diseases with any score
    const possibleDiagnoses = Object.entries(diseases)
        .filter(([_, data]) => data.score > 0)
        .sort((a, b) => b[1].score - a[1].score);

    // Format the diagnosis
    let diagnosis = '';
    if (possibleDiagnoses.length > 0) {
        const [diseaseName, data] = possibleDiagnoses[0];
        
        // Format disease name
        const formatDiseaseName = (name) => {
            return name
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
        };

        diagnosis = `${formattedName ? formattedName + ' has ' : ''}${data.side ? data.side + '-sided ' : ''}${formatDiseaseName(diseaseName)}`;
        
        // Add supporting findings
        const findings = [];
        if (addedSounds.crepitations) findings.push('crepitations');
        if (addedSounds.wheeze) findings.push('wheeze');
        if (addedSounds.rhonchi) findings.push('rhonchi');
        if (addedSounds.pleuralRub) findings.push('pleural rub');
        
        if (findings.length > 0) {
            diagnosis += `\nSupporting findings: ${findings.join(', ')}`;
        }
    } else {
        diagnosis = 'Insufficient findings to generate specific diagnosis';
    }

    // Update the diagnosis textarea
    document.getElementById('provisional_diagnosis').value = diagnosis;
}

// Keep the existing DOMContentLoaded event listener unchanged
document.addEventListener('DOMContentLoaded', function() {
    // Set Diet to Mixed
    document.querySelector('input[name="diet"][value="Mixed"]').checked = true;
    
    // Set Sleep to Normal
    document.querySelector('input[name="sleep"][value="Normal"]').checked = true;
    
    // Set Bowel & Bladder to Regular
    document.querySelector('input[name="bowel"][value="Regular"]').checked = true;
    
    // Set Habits to None
    document.querySelector('input[name="habits"][value="None"]').checked = true;
    
    // Set Exposure to None
    document.querySelector('input[name="exposure"][value="None"]').checked = true;
}); 