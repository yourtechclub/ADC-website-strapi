import type { Route } from './+types/_layout._index';

export default function HomePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-6">
        Welcome to ADC
      </h1>
      <p className="font-body text-lg text-zinc-300">
        The navigation bar should appear above this content.
      </p>
      <p className="font-body text-sm text-zinc-500 mt-4">
        This is the homepage nested under the _layout route, so it inherits the Navigation component.
      </p>
    </div>
  );
}
