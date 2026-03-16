using Baltsped.Tools.Server.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Baltsped.Tools.Server.Database.Configurations;

// Конфигурация таблицы Batch для EF Core
internal class BatchConfiguration : IEntityTypeConfiguration<Batch>
{
    public void Configure(EntityTypeBuilder<Batch> builder)
    {
        builder.ToTable("Batch", "dbo");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("Id");

        builder.Property(x => x.Name)
            .HasColumnName("Name")
            .HasMaxLength(256);
    }
}
