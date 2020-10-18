document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.friendContainer').forEach(container => {
        container.onclick = () => {
            console.log('wow ');
            container.classList.toggle('selected');
        }
    })
});