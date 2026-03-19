using Baltsped.Tools.Server.Database.SqlServer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Baltsped.Tools.Server.Database.SqlServer.Configurations;

// Конфигурация таблицы Container для EF Core
internal class ContainerConfiguration : IEntityTypeConfiguration<Container>
{
    public void Configure(EntityTypeBuilder<Container> builder)
    {
        builder.ToTable("Container", "dbo");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("Id");

        builder.Property(x => x.Code)
            .HasColumnName("Code")
            .HasMaxLength(64);

        builder.Property(x => x.TimeLastUpdate)
            .HasColumnName("TimeLastUpdate");
    }
}
