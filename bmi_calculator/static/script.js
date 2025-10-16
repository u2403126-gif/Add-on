document.getElementById('bmi-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ weight, height }),
        });
        
        const data = await response.json();
        
        const resultDiv = document.getElementById('result');
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        
        resultDiv.style.backgroundColor = data.color + '20'; // Add transparency to the color
        resultDiv.classList.remove('hidden');
        
        bmiValue.textContent = data.bmi;
        bmiValue.style.color = data.color;
        bmiCategory.textContent = `Category: ${data.category}`;
        
        // Smooth scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while calculating BMI');
    }
});