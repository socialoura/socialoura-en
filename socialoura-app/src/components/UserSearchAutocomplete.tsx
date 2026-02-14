"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Search, X, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import type { UnifiedUser } from "@/app/api/search-user/route";

interface UserSearchAutocompleteProps {
  platform: "instagram" | "tiktok";
  onUserSelect?: (user: UnifiedUser) => void;
  placeholder?: string;
  className?: string;
}

export default function UserSearchAutocomplete({
  platform,
  onUserSelect,
  placeholder = "Rechercher un utilisateur...",
  className = "",
}: UserSearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnifiedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UnifiedUser | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search-user?query=${encodeURIComponent(debouncedQuery)}&platform=${platform}`
        );
        const data = await response.json();
        
        if (data.users) {
          setResults(data.users);
          setIsOpen(data.users.length > 0);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, platform]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelectUser(results[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelectUser = (user: UnifiedUser) => {
    setSelectedUser(user);
    setQuery(user.username);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onUserSelect?.(user);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedUser(null);
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <div className="relative">
        {/* Selected User Avatar (left side) */}
        {selectedUser && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
              <Image
                src={selectedUser.avatar_url}
                alt={selectedUser.username}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </div>
        )}

        {/* Search Icon (left side when no user selected) */}
        {!selectedUser && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedUser(null);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full h-12 ${
            selectedUser ? "pl-14" : "pl-11"
          } pr-20 rounded-2xl bg-gray-100 border-2 border-transparent text-gray-900 font-medium placeholder:text-gray-500 outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300`}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          </div>
        )}

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-scale-in"
        >
          <div className="max-h-80 overflow-y-auto">
            {results.map((user, index) => (
              <button
                key={`${user.username}-${index}`}
                onClick={() => handleSelectUser(user)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  highlightedIndex === index
                    ? "bg-purple-50 border-l-4 border-purple-600"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                  <Image
                    src={user.avatar_url}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 truncate">
                      {user.username}
                    </span>
                    {user.is_verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.full_name}</p>
                </div>

                {/* Platform Badge */}
                <div className="flex-shrink-0">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      platform === "instagram"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {platform === "instagram" ? "IG" : "TT"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center font-medium">
              {results.length} résultat{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && !isLoading && query.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-6 z-50 animate-scale-in"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-bold mb-1">Aucun résultat</p>
            <p className="text-sm text-gray-500">
              Essayez un autre nom d'utilisateur
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
