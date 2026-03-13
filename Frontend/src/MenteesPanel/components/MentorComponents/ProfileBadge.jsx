
import { Crown, Star, Award, Sprout } from 'lucide-react';

const ProfileBadge = ({ badge }) => {
    if (!badge) return null;

    const getBadgeStyle = (badgeName) => {
        switch (badgeName) {
            case 'Best Seller':
                return {
                    bg: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20',
                    border: 'border-yellow-400/50',
                    text: 'text-yellow-300',
                    shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.3)]',
                    glow: 'bg-yellow-400/20',
                    Icon: Crown,
                    label: 'Best Seller'
                };
            case 'Level 2 Seller':
                return {
                    bg: 'bg-gradient-to-r from-orange-500/20 to-orange-600/20',
                    border: 'border-orange-400/50',
                    text: 'text-orange-300',
                    shadow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]',
                    glow: 'bg-orange-400/20',
                    Icon: Star,
                    label: 'Level 2'
                };
            case 'Level 1 Seller':
                return {
                    bg: 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20',
                    border: 'border-cyan-400/50',
                    text: 'text-cyan-300',
                    shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]',
                    glow: 'bg-cyan-400/20',
                    Icon: Award,
                    label: 'Level 1'
                };
            case 'Beginner':
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20',
                    border: 'border-gray-400/50',
                    text: 'text-gray-300',
                    shadow: 'shadow-[0_0_15px_rgba(156,163,175,0.3)]',
                    glow: 'bg-gray-400/20',
                    Icon: Sprout,
                    label: 'Beginner'
                };
        }
    };

    const style = getBadgeStyle(badge);
    const IconComponent = style.Icon;

    return (
        <div
            className={`relative group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md ${style.bg} ${style.border} ${style.shadow} transition-all duration-300 hover:scale-105 select-none`}
        >
            {/* Inner Glow */}
            <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${style.glow} blur-md`}></div>

            <IconComponent className={`w-5 h-5 ${style.text} relative z-10`} strokeWidth={2} />
            <span className={`text-sm font-bold tracking-wide ${style.text} relative z-10`}>
                {style.label}
            </span>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden z-20">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] animate-[shimmer_3s_infinite]"></div>
            </div>
        </div>
    );
};

export default ProfileBadge;
