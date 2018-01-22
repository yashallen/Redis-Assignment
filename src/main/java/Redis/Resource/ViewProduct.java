package Redis.Resource;

import redis.clients.jedis.Jedis;

public class ViewProduct {
    public ViewProduct(String id){
        Jedis jedis = new Jedis();
        String name = jedis.hget(id, "viewed");
        Integer val = Integer.parseInt(name);
        val++;
        jedis.hset(id,"viewed",val.toString());
    }

}
