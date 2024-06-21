export default function Footer() {
  const getYear = () => new Date().getFullYear();

  return (
    <footer className="border-t px-6 py-8 text-center text-gray-500">
      <div className="flex justify-center">
        <small className="text-xs">
          &copy; {getYear()} Ryan Gan. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
