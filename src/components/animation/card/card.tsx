import React from 'react';

const Card = ({ image, title, url, color }: { image: string; title: string; url: string; color: string }) => {
  return (
    <div
      className="group relative w-[200px] h-[280px] sm:w-[240px] sm:h-[336px] md:w-[288px] md:h-[384px] lg:w-[320px] lg:h-[432px] xl:w-[360px] xl:h-[480px] bg-gradient-to-br from-white to-gray-50 rounded-3xl text-center transition-all duration-700 ease-out overflow-hidden border border-gray-200/50 hover:border-transparent hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-3 hover:scale-105"
      style={{ '--hover-bg': color } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out rounded-3xl"
        style={{ backgroundImage: `linear-gradient(135deg, ${color}30, ${color}50, ${color}70)` }}
      ></div>
      <div
        className="relative z-10 h-5 w-4/5 mx-auto rounded-b-[56px] transition-all duration-500 ease-out group-hover:h-0 group-hover:scale-x-0"
        style={{ backgroundColor: color, boxShadow: `0 5px 24px ${color}50` }}
      ></div>
      <div className="relative z-20 w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] md:w-[108px] md:h-[108px] lg:w-[120px] lg:h-[120px] xl:w-[135px] xl:h-[135px] mx-auto mt-10 mb-5 rounded-3xl transition-all duration-700 ease-out group-hover:w-[88%] group-hover:h-[60%] group-hover:rounded-[2.5rem] group-hover:mt-5 group-hover:shadow-2xl overflow-hidden">
        <div
          className="w-full h-full rounded-3xl group-hover:rounded-[2.5rem] transition-all duration-700 ease-out bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl group-hover:rounded-[2.5rem]"></div>
        </div>
      </div>
      <div className="relative z-30 px-5 py-3 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:translate-y-4">
        <h2 className="text-xl sm:text-2xl md:text-2.5xl lg:text-3xl xl:text-3.5xl font-bold text-gray-800 leading-tight mb-1">
          {title.split(' ')[0]}
        </h2>
        <span className="text-base sm:text-lg md:text-xl lg:text-1.5xl xl:text-2xl font-medium text-gray-600">
          {title.split(' ').slice(1).join(' ')}
        </span>
      </div>
      <div className="absolute bottom-8 left-0 right-0 z-40 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200 ease-out flex justify-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${title}'s website`}
          className="group/btn relative px-8 py-3 sm:px-10 sm:py-4 bg-white rounded-full font-bold text-base sm:text-lg md:text-xl lg:text-1.5xl xl:text-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent overflow-hidden"
          style={{ color: color }}
        >
          <span className="relative z-10 flex items-center gap-3 sm:gap-4">
            Visitar
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/btn:translate-x-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div
            className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover/btn:opacity-100 transition-all duration-300 rounded-full"
            style={{ backgroundImage: `linear-gradient(100deg, white, ${color})` }}
          ></div>
        </a>
      </div>
      <div
        className="absolute top-8 right-8 w-3 sm:w-3.5 rounded-full h-3 sm:h-3.5 opacity-0 group-hover:opacity-70 transition-all duration-1000 delay-300 ease-out"
        style={{ backgroundColor: color, animation: 'float1 3s ease-in-out infinite', boxShadow: `0 0 12px ${color}80` }}
      ></div>
      <div
        className="absolute top-16 left-10 w-2 sm:w-2.5 rounded-full h-2 sm:h-2.5 opacity-0 group-hover:opacity-50 transition-all duration-1000 delay-500 ease-out"
        style={{ backgroundColor: color, animation: 'float2 4.5s ease-in-out infinite reverse', boxShadow: `0 0 9px ${color}60` }}
      ></div>
      <div
        className="absolute bottom-28 right-10 w-2.5 sm:w-3 rounded-full h-2.5 sm:h-3 opacity-0 group-hover:opacity-60 transition-all duration-1000 delay-700 ease-out"
        style={{ backgroundColor: color, animation: 'float3 3.8s ease-in-out infinite', boxShadow: `0 0 10px ${color}70` }}
      ></div>
      <div
        className="absolute top-24 left-6 w-1.5 sm:w-2 rounded-full h-1.5 sm:h-2 opacity-0 group-hover:opacity-40 transition-all duration-1000 delay-900 ease-out"
        style={{ backgroundColor: color, animation: 'float4 4.2s ease-in-out infinite', boxShadow: `0 0 8px ${color}50` }}
      ></div>
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(7px, -18px) scale(1.3); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(45deg); }
          50% { transform: translate(-12px, 14px) rotate(-45deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-9px, -12px) scale(0.9); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) rotate(-30deg); }
          50% { transform: translate(6px, 18px) rotate(30deg); }
        }
      `}</style>
    </div>
  );
};

export default Card;