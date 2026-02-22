import { NavLink } from 'react-router-dom';
import { Building2, ListTodo, Bookmark, Search } from 'lucide-react';

const navigation = [
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Lists', href: '/lists', icon: ListTodo },
  { name: 'Saved Searches', href: '/saved', icon: Bookmark },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-neutral-900">VC Intelligence</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          <p>VC Intelligence v1.0</p>
          <p className="mt-1">Premium Discovery Tool</p>
        </div>
      </div>
    </aside>
  );
}
