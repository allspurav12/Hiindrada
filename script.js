function updatePlaceholder() {
    const type = document.getElementById('searchType').value;
    const inputField = document.getElementById('inputField');
    if (type === "pincode") {
        inputField.placeholder = "Enter Pin Code (6 digits)";
        inputField.type = "number"; // শুধু সংখ্যা
    } else {
        inputField.placeholder = "Enter Place (e.g., Princep Street)";
        inputField.type = "text";
    }
}

function search() {
    const type = document.getElementById('searchType').value;
    const input = document.getElementById('inputField').value.trim();
    const resultDiv = document.getElementById('result');

    if (!input) {
        resultDiv.innerHTML = "Please enter something!";
        return;
    }

    resultDiv.innerHTML = "Loading..."; // লোডিং মেসেজ

    if (type === "pincode") {
        // পিন কোড ভ্যালিডেশন: শুধু ৬ ডিজিট সংখ্যা
        if (!/^\d{6}$/.test(input)) {
            resultDiv.innerHTML = "Please enter a valid 6-digit Pin Code.";
            return;
        }

        fetch(`https://api.postalpincode.in/pincode/${input}`)
            .then(response => response.json())
            .then(data => {
                if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
                    const postOffice = data[0].PostOffice[0];
                    resultDiv.innerHTML = `Place: ${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;
                } else {
                    resultDiv.innerHTML = "No results found.";
                }
            })
            .catch(error => {
                console.error(error);
                resultDiv.innerHTML = "Error fetching data.";
            });

    } else {
        fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(input)}`)
            .then(response => response.json())
            .then(data => {
                if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
                    resultDiv.innerHTML = `Pin Code: ${data[0].PostOffice[0].Pincode}`;
                } else {
                    resultDiv.innerHTML = "No results found.";
                }
            })
            .catch(error => {
                console.error(error);
                resultDiv.innerHTML = "Error fetching data.";
            });
    }
}

// পেজ লোড হওয়ার সময় প্লেসহোল্ডার আপডেট করা
window.onload = updatePlaceholder;
