export function Footer() {
  return (
    <footer className="footerbg">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <p className="text-center text-sm text-black-foreground">
          &copy; {new Date().getFullYear()} No Rush. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
