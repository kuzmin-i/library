const YMCounter = ({ counter }) => (
  <>
    <script
      key="ym-counter"
      dangerouslySetInnerHTML={{
        __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  
            ym(${counter}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });`,
      }}
    />
    <noscript
      key="ym-counter-noscript"
      dangerouslySetInnerHTML={{
        __html: `<div><img src="https://mc.yandex.ru/watch/${counter}" style="position:absolute; left:-9999px;" alt="" /></div>`,
      }}
    />
  </>
);

export const reachGoal = (counter, goal) => {
  if (counter && typeof window !== undefined) {
    const { ym } = window;

    typeof ym === "function" && ym(counter, "reachGoal", goal);
  }
};

export default YMCounter;
