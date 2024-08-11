import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthScroller = ({ data, setData }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [style, api] = useSpring(() => ({ x: 0 }));
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, months.length);
  }, []);

  const bind = useDrag(({ offset: [x] }) => {
    api.start({ x });
  });

  const handleMonthClick = (month, index) => {
    setSelectedMonth(month);
    setData(oldData => ({
      ...oldData,
      month: index + 1
    }));

    scrollToMonth(index);
  };

  const handleYearClick = (year) => {
    setData(oldData => ({
      ...oldData,
      year 
    }));

  };

  const scrollToMonth = (index) => {
    if (containerRef.current && itemRefs.current[index]) {
      const containerWidth = containerRef.current.clientWidth;
      const itemWidth = itemRefs.current[index].clientWidth;
      const itemLeft = itemRefs.current[index].offsetLeft;

      const scrollOffset = itemLeft - (containerWidth / 2) + (itemWidth / 2);
      containerRef.current.scrollTo({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const monthIndex = (data?.month ?? 1) - 1;
    setSelectedMonth(months[monthIndex]);
    scrollToMonth(monthIndex);
  }, [data.month]);

  return (
    <div className='w-full grid grid-cols-12'>

      <div className='col-span-3 text-sm pt-3 cursor-pointer ml-4 text-white' onClick={()=>handleYearClick(+data.year - 1)}>{+data.year - 1}</div>

      <div
        {...bind()}
        ref={containerRef}
        className="overflow-x-auto whitespace-nowrap cursor-grab hide-scrollbar col-span-6 rounded-xl shadow-lg"
        style={{ width: '100%' }}
      >
        <animated.div
          style={{
            display: 'flex',
            willChange: 'transform',
            transform: style.x.to(x => `translate3d(${x}px,0,0)`)
          }}
        >
          {months.map((month, index) => (
            <div
              key={index}
              ref={el => itemRefs.current[index] = el}
              className={`inline-block px-4 py-2 text-center cursor-pointer ${selectedMonth === month ? 'text-gray-500' : 'text-black'}`}
              onClick={() => handleMonthClick(month, index)}
              style={{ minWidth: '100px' }}
            >
              {month}
            </div>
          ))}
        </animated.div>
      </div>

      <div className='col-span-3  text-sm pt-3 cursor-pointer ml-auto mr-4 text-white' onClick={()=>handleYearClick(+data.year + 1)}>{+data.year + 1}</div>

    </div>
  );
};

export default MonthScroller;
