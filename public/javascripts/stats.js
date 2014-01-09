jQuery(function() {
    var w = window,
        d = document,
        c = 'yandex_metrika_callbacks';
        
    (w[c] = w[c] || []).push(function() {
        try {
            w.yaCounter23584060 = new Ya.Metrika({id: 23584060, enableAll: true});
        }
        catch(e) {}
    });

    var e = d.createElement('script');
    e.type = 'text/javascript';
    e.async = true;
    e.src = (d.location.protocol == 'https:' ? 'https:' : 'http:') + '//mc.yandex.ru/metrika/watch.js';
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
});
