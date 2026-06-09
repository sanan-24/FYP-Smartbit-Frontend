import React, { useState, useRef, useEffect } from 'react';
import { Bike, ChevronDown, Check, User } from 'lucide-react';

const RiderDropdown = ({ riders, selectedRiderId, onAssign, loading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedRider = riders.find(r => r._id === selectedRiderId);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !loading && setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-xs font-black rounded-2xl transition-all duration-300 border-2 ${
                    isOpen 
                    ? 'border-primary-500 bg-white dark:bg-secondary-900 shadow-lg ring-4 ring-primary-500/10' 
                    : 'border-secondary-100 dark:border-secondary-800 bg-secondary-50/50 dark:bg-secondary-800/50 hover:border-primary-500/30'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center truncate mr-2">
                    <Bike className={`h-3.5 w-3.5 mr-2 ${selectedRider ? 'text-primary-500' : 'text-secondary-400'}`} />
                    <span className={`truncate ${selectedRider ? 'text-secondary-900 dark:text-white' : 'text-secondary-400'}`}>
                        {selectedRider ? `${selectedRider.firstName} ${selectedRider.lastName}` : 'Assign Rider'}
                    </span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 text-secondary-400 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 origin-top-right bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {riders.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                                <User className="h-8 w-8 text-secondary-200 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">No Available Riders</p>
                            </div>
                        ) : (
                            <div className="py-1">
                                {riders.map((rider) => (
                                    <button
                                        key={rider._id}
                                        onClick={() => {
                                            onAssign(rider._id);
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-primary-500/5 dark:hover:bg-primary-500/10 transition-colors group"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-7 h-7 rounded-lg bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-[10px] font-black text-secondary-500 group-hover:bg-primary-500/20 group-hover:text-primary-500 transition-colors mr-3">
                                                {rider.firstName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-secondary-900 dark:text-white leading-none mb-1">
                                                    {rider.firstName} {rider.lastName}
                                                </p>
                                                <p className="text-[9px] text-secondary-400 font-bold uppercase tracking-tighter">Available</p>
                                            </div>
                                        </div>
                                        {selectedRiderId === rider._id && (
                                            <Check className="h-3.5 w-3.5 text-primary-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiderDropdown;
