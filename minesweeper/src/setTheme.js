export default function setTheme() {
  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'dark');
  }

  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('body--light-theme');
  }

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.remove('body--light-theme');
  }
}
