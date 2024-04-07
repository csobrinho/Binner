﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Binner.Data.Migrations.SqlServer.Migrations
{
    /// <inheritdoc />
    public partial class AddTmeCountry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TmeApiKey",
                schema: "dbo",
                table: "UserIntegrationConfigurations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TmeApiUrl",
                schema: "dbo",
                table: "UserIntegrationConfigurations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TmeApplicationSecret",
                schema: "dbo",
                table: "UserIntegrationConfigurations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TmeCountry",
                schema: "dbo",
                table: "UserIntegrationConfigurations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TmeEnabled",
                schema: "dbo",
                table: "UserIntegrationConfigurations",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TmeApiKey",
                schema: "dbo",
                table: "UserIntegrationConfigurations");

            migrationBuilder.DropColumn(
                name: "TmeApiUrl",
                schema: "dbo",
                table: "UserIntegrationConfigurations");

            migrationBuilder.DropColumn(
                name: "TmeApplicationSecret",
                schema: "dbo",
                table: "UserIntegrationConfigurations");

            migrationBuilder.DropColumn(
                name: "TmeCountry",
                schema: "dbo",
                table: "UserIntegrationConfigurations");

            migrationBuilder.DropColumn(
                name: "TmeEnabled",
                schema: "dbo",
                table: "UserIntegrationConfigurations");
        }
    }
}
