using Microsoft.EntityFrameworkCore.Migrations;

namespace WebProj.Migrations
{
    public partial class V4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookCollectionSpoj",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookID = table.Column<int>(type: "int", nullable: true),
                    BookCollectionID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookCollectionSpoj", x => x.ID);
                    table.ForeignKey(
                        name: "FK_BookCollectionSpoj_Book_BookID",
                        column: x => x.BookID,
                        principalTable: "Book",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookCollectionSpoj_BookCollection_BookCollectionID",
                        column: x => x.BookCollectionID,
                        principalTable: "BookCollection",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookCollectionSpoj_BookCollectionID",
                table: "BookCollectionSpoj",
                column: "BookCollectionID");

            migrationBuilder.CreateIndex(
                name: "IX_BookCollectionSpoj_BookID",
                table: "BookCollectionSpoj",
                column: "BookID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookCollectionSpoj");
        }
    }
}
