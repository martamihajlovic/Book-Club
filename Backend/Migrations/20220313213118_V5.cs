using Microsoft.EntityFrameworkCore.Migrations;

namespace WebProj.Migrations
{
    public partial class V5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Book_Author_AuthorID",
                table: "Book");

            migrationBuilder.DropForeignKey(
                name: "FK_Book_BookCollection_BookCollectionID",
                table: "Book");

            migrationBuilder.DropIndex(
                name: "IX_Book_BookCollectionID",
                table: "Book");

            migrationBuilder.DropColumn(
                name: "NumOfBooks",
                table: "BookCollection");

            migrationBuilder.DropColumn(
                name: "BookCollectionID",
                table: "Book");

            migrationBuilder.AlterColumn<int>(
                name: "AuthorID",
                table: "Book",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Book_Author_AuthorID",
                table: "Book",
                column: "AuthorID",
                principalTable: "Author",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Book_Author_AuthorID",
                table: "Book");

            migrationBuilder.AddColumn<int>(
                name: "NumOfBooks",
                table: "BookCollection",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "AuthorID",
                table: "Book",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BookCollectionID",
                table: "Book",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Book_BookCollectionID",
                table: "Book",
                column: "BookCollectionID");

            migrationBuilder.AddForeignKey(
                name: "FK_Book_Author_AuthorID",
                table: "Book",
                column: "AuthorID",
                principalTable: "Author",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Book_BookCollection_BookCollectionID",
                table: "Book",
                column: "BookCollectionID",
                principalTable: "BookCollection",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
