package Redis.Functions;


import redis.clients.jedis.Jedis;
import java.util.Map;

public class Trending {
    public Trending(){
        Integer i=1;
        Jedis jedis = new Jedis();
        Long cnt = jedis.dbSize();
        while(cnt>0){
            Map<String,String> map = jedis.hgetAll(i.toString());
            String view = map.get("viewed");
            String cart = map.get("inCart");
            String ordered = map.get("ordered");
            Integer score = 5*(Integer.parseInt(view)) + 10*(Integer.parseInt(cart)) + 20*(Integer.parseInt(ordered));
            jedis.zadd("ranking", score, i.toString());
            i++;
            cnt--;
        }
        for(i = 0; i < 10; i++){
            String player = jedis.zrevrange("ranking", i, i+1).iterator().next();
            System.out.println(jedis.hget(player,"productName"));
        }
        jedis.del("ranking");
    }
}
