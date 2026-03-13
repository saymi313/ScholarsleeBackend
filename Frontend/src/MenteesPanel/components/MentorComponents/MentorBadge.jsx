import { Crown, Star, Award, Sprout } from 'lucide-react';

const MentorBadge = ({ badge }) => {
    if (!badge) return null;

    const getBadgeStyle = (badgeName) => {
        switch (badgeName) {
            case 'Best Seller':
                return {
                    bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
                    text: 'text-white',
                    border: 'border-yellow-300',
                    shadow: 'shadow-[0_0_10px_rgba(250,204,21,0.5)]',
                    Icon: Crown,
                    label: 'Best Seller'
                };
            case 'Level 2 Seller':
                return {
                    bg: 'bg-gradient-to-r from-orange-400 to-orange-600',
                    text: 'text-white',
                    border: 'border-orange-300',
                    shadow: 'shadow-[0_0_10px_rgba(251,146,60,0.5)]',
                    Icon: Star,
                    label: 'Level 2'
                };
            case 'Level 1 Seller':
                return {
                    bg: 'bg-gradient-to-r from-cyan-400 to-cyan-600',
                    text: 'text-white',
                    border: 'border-cyan-300',
                    shadow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]',
                    Icon: Award,
                    label: 'Level 1'
                };
            case 'Beginner':
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-400 to-gray-600',
                    text: 'text-white',
                    border: 'border-gray-300',
                    shadow: 'shadow-sm',
                    Icon: Sprout,
                    label: 'Beginner'
                };
        }
    };

    const style = getBadgeStyle(badge);
    const IconComponent = style.Icon;

    return (
        <div
            className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} ${style.shadow} transition-transform hover:scale-105 cursor-default`}
            title={`${badge} Mentor`}
        >
            <IconComponent className="w-3 h-3" />
            <span>{style.label}</span>
            {/* Sparkle effect overlay */}
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" style={{ animationDuration: '2s' }}></div>
        </div>
    );
};

export default MentorBadge;
