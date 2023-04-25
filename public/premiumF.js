const table = document.querySelector('table');
document.addEventListener('DOMContentLoaded',async(e) => {
    try {
    const allExpense = await axios.get('/premium/getexpense',{
        headers: {
            'token': localStorage.getItem(token)
        }
    })
    console.log(allExpense);
    expenseAll(allExpense.data);
} catch (error) {
        console.log(error);
}
})

function expenseAll(data){
    for(let res of data){
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = res.description;
        cell2.innerHTML = res.category;
        cell3.innerHTML = res.amount;
    }
}