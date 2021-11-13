import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => {
  const dbVariables = {
    type: 'DB_TYPE',
    host: 'DB_HOST',
    port: 'DB_PORT',
    username: 'DB_USERNAME',
    password: 'DB_PASSWORD',
    database: 'DB_DATABASE',
    synchronize: 'DB_SYNCHRONIZE',
  };

  const environmentValues = Object.keys(dbVariables).reduce((current, key) => {
    return { ...current, [key]: process.env[dbVariables[key]] };
  }, {});

  const entities = ['dist/**/*.entity{.ts,.js}'];

  return { ...environmentValues, entities };
};
