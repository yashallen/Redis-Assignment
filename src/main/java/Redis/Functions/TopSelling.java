package Redis.Functions;

import Redis.Main;
import redis.clients.jedis.Jedis;

import java.util.Map;

public class TopSelling {
    public TopSelling(){
        Jedis jedis = new Jedis();
        Integer i=1;
        Long cnt = jedis.dbSize();
        while(cnt > 0){
            Map<String,String> map = jedis.hgetAll(i.toString());
            String ordered = map.get("ordered");
            Integer score = Integer.parseInt(ordered);
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
