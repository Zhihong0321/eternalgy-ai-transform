async function testUpdate() {
    try {
        console.log('--- TESTING API UPDATE PERSISTENCE ---');
        const updateRes = await fetch('http://localhost:5000/api/departments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 1,
                name: 'GLOBAL SALES',
                hod_name: 'John Doe',
                status_update: 'v1.1.0'
            })
        });

        const text = await updateRes.text();
        console.log('Status:', updateRes.status);
        console.log('Response head:', text.substring(0, 200));

        const updateData = JSON.parse(text);
        console.log('Update Response:', updateData);
    } catch (err) {
        console.error('Test failed:', err);
    }
}

testUpdate();
