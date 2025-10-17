package com.logipro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LogiproBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogiproBackendApplication.class, args);
	}


}
