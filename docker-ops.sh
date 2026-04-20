#!/bin/bash

# Docker Quick Reference Script for StickModel

set -e

PROJECT_DIR="/var/www/stickmodel"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== StickModel Docker Operations ===${NC}\n"

# Function to display menu
show_menu() {
    echo "Select an operation:"
    echo "1) View logs"
    echo "2) Restart containers"
    echo "3) Stop containers"
    echo "4) Start containers"
    echo "5) Check status"
    echo "6) Update and restart"
    echo "7) SSH into app container"
    echo "8) SSH into database"
    echo "9) Rebuild from git"
    echo "10) Clean up unused Docker resources"
    echo "0) Exit"
    echo -n "Enter choice (0-10): "
}

# Change to project directory
cd $PROJECT_DIR

while true; do
    show_menu
    read choice
    
    case $choice in
        1)
            echo -e "\n${YELLOW}Viewing logs... (Ctrl+C to exit)${NC}"
            docker compose logs -f stickmodel
            ;;
        2)
            echo -e "\n${YELLOW}Restarting containers...${NC}"
            docker compose restart
            echo -e "${GREEN}✓ Containers restarted${NC}\n"
            docker compose ps
            ;;
        3)
            echo -e "\n${YELLOW}Stopping containers...${NC}"
            docker compose down
            echo -e "${GREEN}✓ Containers stopped${NC}\n"
            ;;
        4)
            echo -e "\n${YELLOW}Starting containers...${NC}"
            docker compose up -d
            echo -e "${GREEN}✓ Containers started${NC}\n"
            docker compose ps
            ;;
        5)
            echo -e "\n${YELLOW}Status:${NC}"
            docker compose ps
            echo -e "\n${YELLOW}Resource usage:${NC}"
            docker stats --no-stream
            ;;
        6)
            echo -e "\n${YELLOW}Updating from git...${NC}"
            git pull origin main
            echo -e "${YELLOW}Rebuilding Docker image...${NC}"
            docker compose build
            echo -e "${YELLOW}Restarting containers...${NC}"
            docker compose up -d
            echo -e "${GREEN}✓ Update complete${NC}\n"
            docker compose logs -f stickmodel
            ;;
        7)
            echo -e "\n${YELLOW}Connecting to app container...${NC}"
            docker compose exec stickmodel sh
            ;;
        8)
            echo -e "\n${YELLOW}Testing database connection...${NC}"
            docker compose exec stickmodel psql $DATABASE_URL -c "SELECT NOW();"
            ;;
        9)
            echo -e "\n${YELLOW}Full rebuild from git...${NC}"
            git pull origin main
            docker compose build --no-cache
            docker compose up -d
            echo -e "${GREEN}✓ Rebuild complete${NC}\n"
            docker compose logs -f stickmodel 2>&1 | head -50
            ;;
        10)
            echo -e "\n${YELLOW}Cleaning Docker resources...${NC}"
            docker system prune -af --volumes
            echo -e "${GREEN}✓ Cleanup complete${NC}\n"
            ;;
        0)
            echo -e "\n${GREEN}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo -e "\n${RED}Invalid choice. Please try again.${NC}\n"
            ;;
    esac
done
