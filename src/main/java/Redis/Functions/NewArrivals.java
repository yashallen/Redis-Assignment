package Redis.Functions;

import redis.clients.jedis.Jedis;

public class NewArrivals {
    public NewArrivals(){
        Jedis jedis = new Jedis();
        Long cnt = jedis.dbSize();
        Integer i = 0;
        while(i<10){
            System.out.println(jedis.hget(cnt.toString(),"productName"));
            i++;
            cnt--;
        }

    }
}
