using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BiTikla.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDeliveryFee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryFee",
                table: "Restaurants");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DeliveryFee",
                table: "Restaurants",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
