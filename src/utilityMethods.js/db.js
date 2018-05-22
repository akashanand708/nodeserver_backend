import mysql from 'mysql';
import databaseConfig from '../../config/database-config';
import { pgPoolErrorHandler } from '../middlewares/errorHandlers';

let connectionConfig = databaseConfig[ process.env.NODE_ENV ],
	connectionPool = mysql.createPool( connectionConfig );

connectionPool.on( 'error', pgPoolErrorHandler );
export default connectionPool;
