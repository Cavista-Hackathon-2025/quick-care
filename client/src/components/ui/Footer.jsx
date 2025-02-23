export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-4">
      <div className="container-custom">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} QuickCare. All rights reserved.
          Brought to you by <a href="#">Cavista Technologies</a>
        </p>
      </div>
    </footer>
  );
}
