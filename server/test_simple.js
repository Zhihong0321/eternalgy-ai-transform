async function testVer() {
    try {
        console.log('--- TESTING API GET ---');
        const res = await fetch('http://localhost:5000/api/departments');
        console.log('GET Status:', res.status);
        const data = await res.json();
        console.log('GET Data length:', data.length);

        console.log('--- TESTING API POST ---');
        const postRes = await fetch('http://localhost:5000/api/departments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 1, name: 'TEST UP' })
        });
        console.log('POST Status:', postRes.status);
        const postText = await postRes.text();
        console.log('POST Response:', postText);
    } catch (err) {
        console.error('Test failed:', err);
    }
}
testVer();
