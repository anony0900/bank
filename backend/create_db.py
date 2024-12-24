import mysql.connector
import os

def setup_database():
    try:
        # First connection to create database if it doesn't exist
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="mysqlboot"
        )
        cursor = connection.cursor()
        
        # Create database if not exists
        cursor.execute("CREATE DATABASE IF NOT EXISTS bank")
        cursor.close()
        connection.close()

        # Second connection to the specific database
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="mysqlboot",
            database="bank"
        )
        cursor = connection.cursor()

        # Read and execute SQL statements one by one
        with open("setup_db.sql", "r") as file:
            sql_commands = file.read().split(';')
            for command in sql_commands:
                command = command.strip()
                if command:  # Skip empty commands
                    try:
                        cursor.execute(command)
                    except mysql.connector.Error as err:
                        print(f"Error executing command: {err}")
                        print(f"Command was: {command}")
                        # Continue with other commands even if one fails
                        continue

        connection.commit()
        print("Database setup completed successfully!!")

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()
    
if __name__ == '__main__':
    setup_database()